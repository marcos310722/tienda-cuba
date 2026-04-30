import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setError('');
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas o cuenta no verificada');
    }
  };

  return (
    // Fondo adaptable
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 py-12 transition-colors duration-300">
      {/* Tarjeta adaptable (usa la clase .card del CSS) */}
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Iniciar Sesión</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Correo electrónico</label>
            <input type="email" {...register('email', { required: 'Campo obligatorio', pattern: { value: /^\S+@\S+$/i, message: 'Correo inválido' } })} className="input" />
            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Contraseña</label>
            <input type="password" {...register('password', { required: 'Campo obligatorio', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })} className="input" />
            {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full flex items-center justify-center space-x-2">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Iniciar Sesión</span>}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <Link to="/recuperar-contrasena" className="text-sm text-cuba-600 dark:text-white hover:underline font-medium">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-slate-400">
          ¿No tienes cuenta? <Link to="/registro" className="text-cuba-600 dark:text-white hover:underline font-medium">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}