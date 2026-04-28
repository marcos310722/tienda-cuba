import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../store/cartStore';
import { ShoppingCart, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Lógica para obtener el nombre o el email
  const displayName = user?.user_metadata?.full_name || user?.email || 'Usuario';

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-cuba-600 dark:text-white">TiendaCuba</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 dark:text-slate-300 hover:text-cuba-600 dark:hover:text-cuba-400 font-medium transition-colors">Inicio</Link>
            <Link to="/productos" className="text-gray-600 dark:text-slate-300 hover:text-cuba-600 dark:hover:text-cuba-400 font-medium transition-colors">Productos</Link>
            <Link to="/contacto" className="text-gray-600 dark:text-slate-300 hover:text-cuba-600 dark:hover:text-cuba-400 font-medium transition-colors">Contáctenos</Link>
            
            {user && isAdmin && (
              <Link to="/admin" className="text-gray-600 dark:text-slate-300 hover:text-cuba-600 dark:hover:text-cuba-400 font-medium transition-colors">Panel Admin</Link>
            )}
            
            {user && !isAdmin && (
              <Link to="/carrito" className="relative text-gray-600 dark:text-slate-300 hover:text-cuba-600 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {count() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {count()}
                  </span>
                )}
              </Link>
            )}
            
            {user && (
              <div className="flex items-center space-x-3">
                {/* AQUÍ ESTÁ EL CAMBIO: Muestra el nombre si existe, sino el email */}
                <span className="text-sm text-gray-500 dark:text-slate-400 font-medium max-w-[150px] truncate" title={displayName}>
                  {displayName}
                </span>
                <button onClick={handleLogout} className="btn btn-secondary flex items-center space-x-1">
                  <LogOut className="w-4 h-4" />
                  <span>Salir</span>
                </button>
              </div>
            )}
            
            {!user && (
              <Link to="/login" className="btn btn-primary flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>Iniciar Sesión</span>
              </Link>
            )}
          </nav>

          <button
            className="md:hidden p-2 rounded-md text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 dark:border-slate-700 space-y-3 bg-white dark:bg-slate-800">
            <Link to="/" className="block text-gray-600 dark:text-slate-300 hover:text-cuba-600 font-medium">Inicio</Link>
            <Link to="/productos" className="block text-gray-600 dark:text-slate-300 hover:text-cuba-600 font-medium">Productos</Link>
            <Link to="/contacto" className="block text-gray-600 dark:text-slate-300 hover:text-cuba-600 font-medium">Contáctenos</Link>
            
            {user && isAdmin && (
              <Link to="/admin" className="block text-gray-600 dark:text-slate-300 hover:text-cuba-600 font-medium">Panel Admin</Link>
            )}
            
            {user && !isAdmin && (
              <Link to="/carrito" className="flex items-center space-x-2 text-gray-600 dark:text-slate-300 hover:text-cuba-600">
                <ShoppingCart className="w-5 h-5" />
                <span>Carrito ({count()})</span>
              </Link>
            )}
            
            {user && (
              <div className="flex items-center space-x-2 py-2 border-t border-gray-100 dark:border-slate-700 mt-2">
                <User className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                {/* AQUÍ TAMBIÉN SE MUESTRA EL NOMBRE */}
                <span className="text-sm text-gray-700 dark:text-slate-200 font-medium truncate">{displayName}</span>
              </div>
            )}
            
            {user && (
              <button onClick={handleLogout} className="w-full text-left text-red-600 hover:text-red-700 font-medium flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            )}
            
            {!user && (
              <Link to="/login" className="block btn btn-primary w-full text-center">Iniciar Sesión</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}