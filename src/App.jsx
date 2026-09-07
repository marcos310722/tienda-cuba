import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth - Lazy loading
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword'));
const UpdatePassword = React.lazy(() => import('./pages/auth/UpdatePassword'));

// Public Pages - Lazy loading
const Home = React.lazy(() => import('./pages/public/Home'));
const Products = React.lazy(() => import('./pages/public/Products'));
const Cart = React.lazy(() => import('./pages/public/Cart'));
const Checkout = React.lazy(() => import('./pages/public/Checkout'));
const Contact = React.lazy(() => import('./pages/public/Contact'));

// Admin Pages - Lazy loading
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = React.lazy(() => import('./pages/admin/Products'));
const AdminCategories = React.lazy(() => import('./pages/admin/Categories'));
const AdminOrders = React.lazy(() => import('./pages/admin/Orders'));
const AdminUsers = React.lazy(() => import('./pages/admin/Users'));

// Placeholder para detalle de producto (opcional)
const ProductDetail = () => <div className="max-w-7xl mx-auto px-4 py-12 text-center">Detalle de producto próximamente</div>;

export default function App() {
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cuba-600"></div></div>}>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* --- RUTAS PÚBLICAS (Sin Login) --- */}
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/contacto" element={<Contact />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
            <Route path="/recuperar-contrasena/nueva" element={<UpdatePassword />} />

            {/* --- RUTAS PROTEGIDAS (Requiere Login) --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<Checkout />} />
            </Route>

            {/* --- RUTAS ADMIN (Requiere Admin) --- */}
            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/productos" element={<AdminProducts />} />
              <Route path="/admin/categorias" element={<AdminCategories />} />
              <Route path="/admin/pedidos" element={<AdminOrders />} />
              <Route path="/admin/usuarios" element={<AdminUsers />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<div className="text-center py-20 text-2xl text-gray-500 dark:text-slate-400">Página no encontrada</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </React.Suspense>
  );
}