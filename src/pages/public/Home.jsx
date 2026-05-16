import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import ProductCard from '../../components/product/ProductCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import WhatsAppButton from '../../components/ui/WhatsAppButton';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(8);
        if (data) setProducts(data);
      } catch (error) {
        console.error('Error cargando destacados:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Tienda Virtual Cuba
        </h1>
        <p className="mt-2 text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
          Moda y estilo con entrega rápida. Paga fácil por Transfermóvil.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Muestra 4 esqueletos mientras carga
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          products.map(p => <ProductCard key={p.id} product={p} />)
        )}
      </div>

      <WhatsAppButton />
    </div>
  );
}
