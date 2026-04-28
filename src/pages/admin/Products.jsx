import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useForm } from 'react-hook-form';
import { formatCUP } from '../../utils/helpers';
import { Loader2, Plus, Edit2, Trash2, Upload, X, Save, ImageOff } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: { 
      name: '', 
      description: '', 
      price_cup: 0, 
      stock: 0, 
      category_id: '', 
      image_url: '', 
      active: true 
    }
  });

  useEffect(() => {
    const loadData = async () => {
      const [prodRes, catRes] = await Promise.all([
        supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name')
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setLoading(false);
    };
    loadData();
  }, []);

  const openForm = (product = null) => {
    setEditingId(product?.id || null);
    if (product) {
      setValue('name', product.name);
      setValue('description', product.description || '');
      setValue('price_cup', product.price_cup);
      setValue('stock', product.stock);
      setValue('category_id', product.category_id || '');
      setValue('image_url', product.image_url || '');
      setValue('active', product.active);
    } else {
      reset();
    }
    setImageFile(null);
    setShowForm(true);
  };

const onSubmit = async (data) => {
  setIsSubmitting(true);
  try {
    console.log('🔍 Iniciando upload...', imageFile);
    
    let imageUrl = data.image_url;
    if (imageFile) {
      console.log('📤 Subiendo archivo:', imageFile.name, imageFile.type, imageFile.size);
      
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
      console.log('📁 Nombre archivo:', fileName);
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('product-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      console.log('✅ Upload response:', uploadData);
      console.log('❌ Upload error:', uploadError);
      
      if (uploadError) {
        throw new Error(`Storage error: ${uploadError.message}`);
      }
      
      const { data: { publicUrl } } = supabase
        .storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      console.log('🔗 Public URL:', publicUrl);
      imageUrl = publicUrl;
    }
    
      
      const payload = {
        name: data.name.trim(),
        description: data.description?.trim() || '',
        price_cup: parseFloat(data.price_cup),
        stock: parseInt(data.stock),
        category_id: data.category_id || null,
        image_url: imageUrl,
        active: data.active
      };

      if (editingId) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert(payload);
        if (error) throw error;
      }

      // Recargar lista actualizada
      const { data: updated } = await supabase
        .from('products')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });
      
      setProducts(updated || []);
      setShowForm(false);
      setEditingId(null);
      reset();
      
    } catch (error) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('¿Eliminar este producto permanentemente?')) return;
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== id));
    } else {
      alert('Error al eliminar: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cuba-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <button 
          onClick={() => openForm()} 
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nuevo Producto
        </button>
      </div>

      {showForm && (
        <div className="card mb-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold mb-4">
            {editingId ? 'Editar Producto' : 'Agregar Producto'}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register('name', { required: true })} placeholder="Nombre del producto" className="input" />
            <input {...register('description')} placeholder="Descripción (opcional)" className="input" />
            <input {...register('price_cup', { required: true, min: 0 })} type="number" step="0.01" placeholder="Precio CUP" className="input" />
            <input {...register('stock', { required: true, min: 0 })} type="number" placeholder="Stock disponible" className="input" />
            
            <select {...register('category_id')} className="input">
              <option value="">Sin categoría</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            
            <div className="flex items-center gap-2">
              <label className="flex-1 btn btn-secondary cursor-pointer flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" /> 
                {imageFile ? imageFile.name : 'Subir Imagen'}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={e => setImageFile(e.target.files?.[0] || null)} 
                />
              </label>
              {watch('image_url') && (
                <span className="text-xs text-gray-500 truncate max-w-[120px]">
                  URL: {watch('image_url')}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 md:col-span-2">
              <input 
                type="checkbox" 
                id="active" 
                {...register('active')} 
                className="w-4 h-4 rounded border-gray-300 text-cuba-600 focus:ring-cuba-500" 
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">
                Producto activo
              </label>
            </div>
            
            <div className="flex gap-2 md:col-span-2">
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="btn btn-primary flex items-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <><Save className="w-4 h-4" /> Guardar</>
                )}
              </button>
              <button 
                type="button" 
                onClick={() => { 
                  setShowForm(false); 
                  setEditingId(null); 
                  reset(); 
                  setImageFile(null); 
                }} 
                className="btn btn-secondary flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[800px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">Imagen</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {p.image_url ? (
                    <img 
                      src={p.image_url} 
                      alt={p.name} 
                      className="w-12 h-12 object-cover rounded-md border" 
                      loading="lazy" 
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center border">
                      <ImageOff className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{p.categories?.name || '-'}</td>
                <td className="p-3">{formatCUP(p.price_cup)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  {p.active ? (
                    <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Activo</span>
                  ) : (
                    <span className="text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded-full">Inactivo</span>
                  )}
                </td>
                <td className="p-3 space-x-2">
                  <button 
                    onClick={() => openForm(p)} 
                    className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteProduct(p.id)} 
                    className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  No hay productos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}