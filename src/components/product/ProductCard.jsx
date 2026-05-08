import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../store/cartStore';
import { formatCUP } from '../../utils/helpers';
import { ShoppingCart } from 'lucide-react';

const ProductCard = memo(function ProductCard({ product }) {
  const { addItem } = useCart();
  
  const handleAdd = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price_cup: product.price_cup,
      image_url: product.image_url
    });
  }, [addItem, product.id, product.name, product.price_cup, product.image_url]);
  
  const imageUrl = product.image_url || 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=Sin+Imagen';
  
  return (
    <div className="card flex flex-col h-full transition-shadow hover:shadow-md">
      <Link to={`/producto/${product.id}`} className="block flex-grow">
        <div className="aspect-square bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden mb-3">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
            width="300"
            height="300"
          />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 mt-1">{product.description || 'Sin descripción'}</p>
      </Link>
      <div className="mt-auto pt-3 flex items-center justify-between">
        <span className="text-lg font-bold text-cuba-600 dark:text-white">{formatCUP(product.price_cup)}</span>
        <button
          onClick={handleAdd}
          className="btn btn-primary flex items-center space-x-1 text-sm px-3 py-1.5"
          aria-label={`Añadir ${product.name} al carrito`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Añadir</span>
        </button>
      </div>
    </div>
  );
});

export default ProductCard;
