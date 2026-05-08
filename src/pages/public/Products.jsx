import { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import ProductCard from '../../components/product/ProductCard';
import { Loader2 } from 'lucide-react';
import { getFromCache, saveToCache } from '../../utils/localCache';

const PRODUCTS_CACHE_KEY = 'tienda-cuba-products-all';
const CATEGORIES_CACHE_KEY = 'tienda-cuba-categories';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      // Intentar caché para productos
      const cachedProducts = getFromCache(PRODUCTS_CACHE_KEY, CACHE_TTL);
      const cachedCategories = getFromCache(CATEGORIES_CACHE_KEY, CACHE_TTL);
      
      if (cachedProducts && cachedCategories) {
        setProducts(cachedProducts);
        setCategories(cachedCategories);
        setLoading(false);
        return;
      }
      
      try {
        const [prodRes, catRes] = await Promise.all([
          supabase.from('products').select('*').eq('active', true).order('created_at', { ascending: false }),
          supabase.from('categories').select('*').order('name')
        ]);
        
        const productsData = prodRes.data || [];
        const categoriesData = catRes.data || [];
        
        setProducts(productsData);
        setCategories(categoriesData);
        
        // Guardar en caché
        saveToCache(productsData, PRODUCTS_CACHE_KEY, CACHE_TTL);
        saveToCache(categoriesData, CATEGORIES_CACHE_KEY, CACHE_TTL);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase().trim();
    return products.filter(p => {
      const matchCat = selectedCat === 'all' || p.category_id === selectedCat;
      if (!matchCat) return false;
      
      if (!searchLower) return true;
      
      const nameMatch = p.name.toLowerCase().includes(searchLower);
      const descMatch = (p.description || '').toLowerCase().includes(searchLower);
      return nameMatch || descMatch;
    });
  }, [products, selectedCat, search]);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setSelectedCat(e.target.value);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Catálogo Completo</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={search}
          onChange={handleSearchChange}
          className="input flex-1"
          aria-label="Buscar productos"
        />
        <select
          value={selectedCat}
          onChange={handleCategoryChange}
          className="input md:w-64"
          aria-label="Filtrar por categoría"
        >
          <option value="all">Todas las categorías</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-cuba-500" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-slate-400 py-12">No se encontraron productos.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
