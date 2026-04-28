import { useCart } from '../../store/cartStore';
import { formatCUP } from '../../utils/helpers';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-600 mb-6">Explora nuestro catálogo y añade lo que necesites.</p>
        <Link to="/productos" className="btn btn-primary inline-flex items-center space-x-2">
          <span>Ver Productos</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-6">Carrito de Compras</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="card flex items-center gap-4">
              <img src={item.image_url || 'https://via.placeholder.com/100'} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">{formatCUP(item.price_cup)} / unidad</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded hover:bg-gray-100 border border-gray-200"><Minus className="w-4 h-4" /></button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded hover:bg-gray-100 border border-gray-200"><Plus className="w-4 h-4" /></button>
                <button onClick={() => removeItem(item.id)} className="p-1 text-red-500 hover:bg-red-50 rounded ml-2"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="text-sm text-red-600 hover:text-red-700 font-medium mt-2">Vaciar carrito</button>
        </div>
        <div className="card h-fit">
          <h3 className="text-lg font-semibold mb-4">Resumen</h3>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span>Subtotal</span>
            <span className="font-medium">{formatCUP(total())}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span>Envío</span>
            <span className="text-green-600 font-medium">Gratis</span>
          </div>
          <div className="flex justify-between py-3 text-lg font-bold">
            <span>Total</span>
            <span>{formatCUP(total())}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary w-full mt-4 flex items-center justify-center space-x-2">
            <span>Proceder al Pago</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}