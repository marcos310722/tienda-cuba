import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-gray-300 dark:text-slate-400 py-8 mt-auto border-t border-gray-800 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-white dark:text-slate-200 text-lg font-semibold mb-3">TiendaCuba</h3>
          <p className="text-sm text-gray-400 dark:text-slate-500">
            Sistema de administración y tienda virtual adaptado para Cuba.
            Pagos por Transfermóvil, EnZona o efectivo.
          </p>
        </div>
        <div>
          <h3 className="text-white dark:text-slate-200 text-lg font-semibold mb-3">Enlaces</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white dark:hover:text-slate-200 transition">Inicio</Link></li>
            <li><Link to="/productos" className="hover:text-white dark:hover:text-slate-200 transition">Productos</Link></li>
            <li><Link to="/login" className="hover:text-white dark:hover:text-slate-200 transition">Mi Cuenta</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white dark:text-slate-200 text-lg font-semibold mb-3">Contacto</h3>
          <p className="text-sm text-gray-400 dark:text-slate-500">📞 +53 55553302</p>
          <p className="text-sm text-gray-400 dark:text-slate-500">📧 marcosdespaigne0@gmail.com</p>
        </div>
      </div>
      <div className="border-t border-gray-800 dark:border-slate-800 mt-8 pt-4 text-center text-sm text-gray-500 dark:text-slate-600">
        © {new Date().getFullYear()} TiendaCuba. Todos los derechos reservados.
      </div>
    </footer>
  );
}