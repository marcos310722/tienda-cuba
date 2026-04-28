import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { formatCUP } from '../../utils/helpers';
import { Loader2, Eye, RefreshCw } from 'lucide-react';

const exportToCSV = (orders) => {
  const headers = ['ID', 'Cliente', 'Teléfono', 'Dirección', 'Método Pago', 'Total CUP', 'Estado', 'Fecha'];
  const rows = orders.map(o => [
    o.id.slice(0, 8),
    o.customer_name || '',
    o.customer_phone || '',
    o.customer_address || '',
    o.payment_method || '',
    o.total_cup,
    o.status,
    new Date(o.created_at).toLocaleString('es-CU')
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pedidos-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const StatusBadge = ({ status }) => {
  const styles = {
    pendiente_pago: 'bg-yellow-100 text-yellow-800',
    confirmado: 'bg-blue-100 text-blue-800',
    enviado: 'bg-purple-100 text-purple-800',
    entregado: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800'
  };
  return <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || 'bg-gray-100 text-gray-800'}`}>{status.replace('_', ' ')}</span>;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [orderItems, setOrderItems] = useState({});

  useEffect(() => { fetchOrders(); }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') query = query.eq('status', filter);
    const { data } = await query;
    setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (!error) setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    else alert('Error al actualizar estado: ' + error.message);
  };

  const loadItems = async (orderId) => {
    if (orderItems[orderId]) return;
    const { data } = await supabase.from('order_items').select('*, products(name, price_cup)').eq('order_id', orderId);
    setOrderItems(prev => ({ ...prev, [orderId]: data || [] }));
  };

  const toggleExpand = async (id) => {
    if (expandedId === id) return setExpandedId(null);
    setExpandedId(id);
    await loadItems(id);
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-cuba-500" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Gestión de Pedidos</h1>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pendiente_pago', 'confirmado', 'enviado', 'entregado', 'cancelado'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`btn text-xs ${filter === f ? 'btn-primary' : 'btn-secondary'}`}>
              {f === 'all' ? 'Todos' : f.replace('_', ' ')}
            </button>
          ))}
          <button onClick={fetchOrders} className="btn btn-secondary p-2"><RefreshCw className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">ID</th><th className="p-3">Cliente</th><th className="p-3">Teléfono</th><th className="p-3">Total</th><th className="p-3">Pago</th><th className="p-3">Estado</th><th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono">{o.id.slice(0, 8)}</td>
                <td className="p-3">{o.customer_name || '-'}</td>
                <td className="p-3">{o.customer_phone || '-'}</td>
                <td className="p-3 font-medium">{formatCUP(o.total_cup)}</td>
                <td className="p-3 capitalize">{o.payment_method || '-'}</td>
                <td className="p-3"><StatusBadge status={o.status} /></td>
                <td className="p-3 space-x-2">
                  <button onClick={() => toggleExpand(o.id)} className="text-blue-600 hover:underline text-xs flex items-center gap-1"><Eye className="w-4 h-4" /> Ver</button>
                  <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="border rounded px-1 py-0.5 text-xs focus:ring-cuba-500">
                    {['pendiente_pago', 'confirmado', 'enviado', 'entregado', 'cancelado'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {expandedId && orderItems[expandedId] && (
              <tr className="bg-gray-50">
                <td colSpan="7" className="p-4">
                  <h4 className="font-medium mb-2">Productos del pedido:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {orderItems[expandedId].map(item => (
                      <li key={item.id}>{item.products?.name || 'Producto'} x{item.quantity} - {formatCUP(item.unit_price_cup * item.quantity)}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center py-8 text-gray-500">No hay pedidos con este filtro.</p>}
      </div>
    </div>
  );
}