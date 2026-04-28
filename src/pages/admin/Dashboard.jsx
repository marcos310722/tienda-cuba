import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { formatCUP } from '../../utils/helpers';
import {
  Package, ShoppingCart, AlertCircle, TrendingUp, ArrowRight,
  Plus, Edit2, Trash2, Save, X, Loader2, Users
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

// Componente para los badges de estado (Actualizado para Dark Mode)
const StatusBadge = ({ status }) => {
  const styles = {
    pendiente_pago: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    confirmado: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    enviado: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
    entregado: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    cancelado: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
      {status.replace('_', ' ')}
    </span>
  );
};

// Componente Tarjeta de Estadística (Actualizado para Dark Mode)
const StatCard = ({ icon: Icon, title, value, color, link }) => (
  <Link to={link} className="card hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-slate-400">{title}</p>
        <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </Link>
);

export default function AdminDashboard() {
  // Stats
  const [stats, setStats] = useState({ products: 0, orders: 0, pending: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  // Categories
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [isCatSubmitting, setIsCatSubmitting] = useState(false);

  const { register: regCat, handleSubmit: handleSubmitCat, reset: resetCat, setValue: setValueCat } = useForm({
    defaultValues: { name: '', slug: '' }
  });

  useEffect(() => {
    const fetchAll = async () => {
      // Stats & Orders
      const [{ count: productsCount }, { data: orders }, { data: cats }] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('categories').select('*').order('name')
      ]);

      const pending = orders?.filter(o => o.status === 'pendiente_pago').length || 0;
      const revenue = orders?.reduce((sum, o) => sum + (o.total_cup || 0), 0) || 0;

      setStats({ products: productsCount || 0, orders: orders?.length || 0, pending, revenue });
      setRecentOrders(orders || []);
      setCategories(cats || []);
      setCatLoading(false);
    };
    fetchAll();
  }, []);

  // Category CRUD Handlers
  const generateSlug = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

  const openCatForm = (cat = null) => {
    setEditingCatId(cat?.id || null);
    if (cat) {
      setValueCat('name', cat.name);
      setValueCat('slug', cat.slug);
    } else {
      resetCat();
    }
    setShowCatForm(true);
  };

  const onSubmitCat = async (data) => {
    setIsCatSubmitting(true);
    try {
      const slug = data.slug || generateSlug(data.name);
      const payload = { name: data.name.trim(), slug: slug.toLowerCase() };

      if (editingCatId) {
        await supabase.from('categories').update(payload).eq('id', editingCatId);
      } else {
        await supabase.from('categories').insert(payload);
      }

      const { data: updated } = await supabase.from('categories').select('*').order('name');
      setCategories(updated || []);
      setShowCatForm(false);
      setEditingCatId(null);
      resetCat();
    } catch (error) {
      alert('Error al guardar categoría: ' + error.message);
    } finally {
      setIsCatSubmitting(false);
    }
  };

  const deleteCat = async (id) => {
    if (!window.confirm('¿Eliminar categoría? Los productos asociados quedarán sin categoría.')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) setCategories(prev => prev.filter(c => c.id !== id));
    else alert('Error al eliminar: ' + error.message);
  };

  if (catLoading && !stats.products) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-cuba-500" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel de Administración</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} title="Productos Activos" value={stats.products} color="bg-blue-500" link="/admin/productos" />
        <StatCard icon={ShoppingCart} title="Total Pedidos" value={stats.orders} color="bg-green-500" link="/admin/pedidos" />
        <StatCard icon={AlertCircle} title="Pendientes de Pago" value={stats.pending} color="bg-amber-500" link="/admin/pedidos" />
        <StatCard icon={TrendingUp} title="Ingresos Totales" value={formatCUP(stats.revenue)} color="bg-purple-500" link="/admin/pedidos" />

        {/* Card Usuarios */}
        <Link to="/admin/usuarios" className="card hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">Usuarios</p>
              <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">Gestionar</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-500">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Link>
      </div>

      {/* CATEGORIES CRUD */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Gestión de Categorías</h2>
          <button onClick={() => openCatForm()} className="btn btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Nueva Categoría
          </button>
        </div>

        {showCatForm && (
          <form onSubmit={handleSubmitCat(onSubmitCat)} className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg mb-4 border border-gray-200 dark:border-slate-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                {...regCat('name', { required: true })}
                placeholder="Nombre (ej: Electrónica)"
                className="input"
                onChange={e => {
                  regCat('name').onChange(e);
                  if (!editingCatId) setValueCat('slug', generateSlug(e.target.value));
                }}
              />
              <input {...regCat('slug')} placeholder="Slug (ej: electronica)" className="input" readOnly={!editingCatId} />
              <div className="flex gap-2">
                <button type="submit" disabled={isCatSubmitting} className="btn btn-primary flex-1 flex items-center justify-center gap-2">
                  {isCatSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Guardar</>}
                </button>
                <button type="button" onClick={() => { setShowCatForm(false); setEditingCatId(null); resetCat(); }} className="btn btn-secondary">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-slate-700 border-b dark:border-slate-600">
              <tr>
                <th className="p-3 text-gray-700 dark:text-slate-200">Nombre</th>
                <th className="p-3 text-gray-700 dark:text-slate-200">Slug</th>
                <th className="p-3 text-gray-700 dark:text-slate-200">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="p-3 font-medium text-gray-900 dark:text-slate-100">{cat.name}</td>
                  <td className="p-3 font-mono text-xs text-gray-600 dark:text-slate-400">{cat.slug}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => openCatForm(cat)} className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1 rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteCat(cat.id)} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && <tr><td colSpan="3" className="p-6 text-center text-gray-500 dark:text-slate-400">No hay categorías</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pedidos Recientes</h2>
          <Link to="/admin/pedidos" className="text-cuba-600 dark:text-cuba-400 hover:underline text-sm font-medium flex items-center">
            Ver todos <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        {recentOrders.length === 0 ? <p className="text-gray-500 dark:text-slate-400 text-center py-4">No hay pedidos aún.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-slate-700 border-b dark:border-slate-600">
                <tr>
                  <th className="p-3 text-gray-700 dark:text-slate-200">ID</th>
                  <th className="p-3 text-gray-700 dark:text-slate-200">Cliente</th>
                  <th className="p-3 text-gray-700 dark:text-slate-200">Total</th>
                  <th className="p-3 text-gray-700 dark:text-slate-200">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="p-3 font-mono text-gray-600 dark:text-slate-400">{o.id.slice(0, 8)}</td>
                    <td className="p-3 text-gray-900 dark:text-slate-100">{o.customer_name || 'Anónimo'}</td>
                    <td className="p-3 font-medium text-gray-900 dark:text-slate-100">{formatCUP(o.total_cup)}</td>
                    <td className="p-3"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}