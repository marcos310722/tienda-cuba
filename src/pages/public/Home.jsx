import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import ProductCard from '../../components/product/ProductCard';
import { Loader2 } from 'lucide-react';
import WhatsAppButton from '../../components/ui/WhatsAppButton';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(8);
      if (!error) setProducts(data || []);
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        {/* Texto adaptado a modo oscuro */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Tienda Virtual Cuba</h1>
        <p className="mt-2 text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">Productos seleccionados. Pago fácil por Transfermóvil, EnZona o efectivo.</p>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-cuba-500" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
          {/* El botón flotante debe estar fuera del grid o posicionado fixed, aquí lo dejo al final del contenedor principal */}
        </div>
      )}
      <WhatsAppButton />
    </div>
  );
}