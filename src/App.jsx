import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import UpdatePassword from './pages/auth/UpdatePassword';

// Public Pages
import Home from './pages/public/Home';
import Products from './pages/public/Products';
import Cart from './pages/public/Cart';
import Checkout from './pages/public/Checkout';
import Contact from './pages/public/Contact'; // Importado

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';

// Placeholder para detalle de producto (opcional)
const ProductDetail = () => <div className="max-w-7xl mx-auto px-4 py-12 text-center">Detalle de producto próximamente</div>;

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* --- RUTAS PÚBLICAS (Sin Login) --- */}
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/contacto" element={<Contact />} /> {/* ✅ RUTA PÚBLICA DE CONTACTO */}
          
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
  );
}