import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../store/cartStore';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { formatCUP } from '../../utils/helpers';
import { Loader2, CreditCard, Phone, MapPin, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [orderCreated, setOrderCreated] = useState(null);
  const [error, setError] = useState('');

  // Protección extra por si alguien modifica rutas manualmente
  if (items.length === 0 && !orderCreated) {
    navigate('/carrito');
    return null;
  }

  const onSubmit = async (data) => {
    setError('');
    try {
      const totalAmount = total();
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_cup: totalAmount,
          status: 'pendiente_pago',
          payment_method: data.paymentMethod,
          customer_name: data.fullName,
          customer_phone: data.phone,
          customer_address: data.address,
          notes: `Teléfono contacto: ${data.phone}`
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(i => ({
        order_id: order.id,
        product_id: i.id,
        quantity: i.quantity,
        unit_price_cup: i.price_cup
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      setOrderCreated(order);
    } catch (err) {
      setError(err.message || 'Error al procesar el pedido. Inténtalo de nuevo.');
    }
  };

  if (orderCreated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido Creado!</h2>
        <p className="text-gray-600 mb-6">Pedido #{orderCreated.id.slice(0, 8).toUpperCase()} registrado.</p>
        <div className="card text-left mb-6 space-y-3 bg-amber-50 border-amber-200">
          <h3 className="font-semibold text-amber-800">📋 Instrucciones de Pago:</h3>
          <p className="text-sm text-gray-800">1. Transfiere exactamente <strong>{formatCUP(orderCreated.total_cup)}</strong> a:</p>
          <div className="bg-white p-3 rounded text-sm font-mono space-y-1 border border-amber-200">
            <p>📱 Transfermóvil: <strong>+53 55553302</strong></p>
            <p>🏦 EnZona: <strong>mdespaigne56744</strong></p>
            <p>💳 Tarjeta CUP: <strong>9238-1299-7585-6404</strong></p>
          </div>
          <p className="text-sm text-gray-800">2. Envía captura del comprobante por WhatsApp al <strong>+53 5XXX XXXX</strong> indicando: <em>"Pedido #{orderCreated.id.slice(0, 8).toUpperCase()}"</em></p>
          <p className="text-sm text-red-600 font-medium">⚠️ El pedido se mantendrá pendiente máximo 24 horas sin confirmación.</p>
        </div>
        <button onClick={() => navigate('/')} className="btn btn-primary">Volver al Inicio</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Finalizar Compra</h2>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
          <input {...register('fullName', { required: 'Campo obligatorio' })} className="input" />
          {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Phone className="w-4 h-4"/> Teléfono</label>
            <input {...register('phone', { required: 'Campo obligatorio' })} className="input" placeholder="+53" />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><MapPin className="w-4 h-4"/> Dirección</label>
            <input {...register('address', { required: 'Campo obligatorio' })} className="input" />
            {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><CreditCard className="w-4 h-4"/> Método de pago</label>
          <select {...register('paymentMethod', { required: 'Selecciona un método' })} className="input">
            <option value="">Selecciona...</option>
            <option value="transfermovil">Transfermóvil</option>
            <option value="enzona">EnZona</option>
            <option value="efectivo">Efectivo contra entrega</option>
          </select>
          {errors.paymentMethod && <p className="mt-1 text-xs text-red-600">{errors.paymentMethod.message}</p>}
        </div>
        <div className="card mt-6 bg-gray-50">
          <h3 className="font-semibold mb-2">Resumen</h3>
          <div className="space-y-1 text-sm text-gray-600">
            {items.map(i => (
              <div key={i.id} className="flex justify-between">
                <span>{i.name} x{i.quantity}</span>
                <span>{formatCUP(i.price_cup * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-3 mt-3 border-t border-gray-200 font-bold text-lg">
            <span>Total a pagar</span>
            <span>{formatCUP(total())}</span>
          </div>
        </div>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full flex items-center justify-center space-x-2 mt-4">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Crear Pedido</span>}
        </button>
      </form>
    </div>
  );
}