import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useForm } from 'react-hook-form';
import { Loader2, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: { name: '', slug: '' }
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (!error) setCategories(data || []);
    setLoading(false);
  };

  const openForm = (category = null) => {
    setEditingId(category?.id || null);
    if (category) {
      setValue('name', category.name);
      setValue('slug', category.slug);
    } else {
      reset();
    }
    setShowForm(true);
  };

  const generateSlug = (text) => {
    return text.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const slug = data.slug || generateSlug(data.name);
      const payload = {
        name: data.name.trim(),
        slug: slug.toLowerCase()
      };

      if (editingId) {
        const { error } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert(payload);
        if (error) throw error;
      }

      await fetchCategories();
      setShowForm(false);
      setEditingId(null);
      reset();
    } catch (error) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('¿Eliminar esta categoría? Los productos asociados quedarán sin categoría.')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      setCategories(prev => prev.filter(c => c.id !== id));
    } else {
      alert('Error al eliminar: ' + error.message);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-cuba-500" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Categorías</h1>
        <button onClick={() => openForm()} className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nueva Categoría
        </button>
      </div>

      {showForm && (
        <div className="card mb-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold mb-4">{editingId ? 'Editar Categoría' : 'Agregar Categoría'}</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input 
                {...register('name', { required: 'Campo obligatorio' })} 
                className="input" 
                placeholder="Ej: Electrónica"
                onChange={(e) => {
                  const name = e.target.value;
                  setValue('name', name);
                  if (!editingId) setValue('slug', generateSlug(name));
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
              <input 
                {...register('slug')} 
                className="input" 
                placeholder="ej: electronica"
                readOnly={!editingId}
              />
            </div>
            <div className="flex gap-2 md:col-span-2">
              <button type="submit" disabled={isSubmitting} className="btn btn-primary flex items-center gap-2">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Guardar</>}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); reset(); }} className="btn btn-secondary flex items-center gap-2">
                <X className="w-4 h-4" /> Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Fecha creación</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{cat.name}</td>
                <td className="p-3 font-mono text-xs text-gray-600">{cat.slug}</td>
                <td className="p-3 text-gray-500">{new Date(cat.created_at).toLocaleDateString('es-CU')}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => openForm(cat)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteCategory(cat.id)} className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">No hay categorías registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}