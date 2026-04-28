import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const [error, setError] = useState('');
  const password = watch('password', '');

  const onSubmit = async (data) => {
    setError('');
    const { data: { session }, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.fullName, phone: data.phone } },
    });

    if (error) {
      setError(error.message);
    } else if (session) {
      navigate('/');
    } else {
      alert('Registro exitoso. Revisa tu correo o desactiva la confirmación en Supabase para pruebas locales.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 py-12 transition-colors duration-300">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Crear Cuenta</h2>
        
        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800">{error}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Nombre completo</label>
            <input type="text" {...register('fullName', { required: 'Campo obligatorio' })} className="input" />
            {errors.fullName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Correo</label>
            <input type="email" {...register('email', { required: 'Campo obligatorio', pattern: { value: /^\S+@\S+$/i, message: 'Correo inválido' } })} className="input" />
            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Teléfono (opcional)</label>
            <input type="tel" {...register('phone')} className="input" placeholder="+53 XXXXXXXX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Contraseña</label>
            <input type="password" {...register('password', { required: 'Campo obligatorio', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })} className="input" />
            {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Confirmar contraseña</label>
            <input type="password" {...register('confirmPassword', { required: 'Campo obligatorio', validate: (v) => v === password || 'No coinciden' })} className="input" />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full flex items-center justify-center space-x-2">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Crear Cuenta</span>}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-slate-400">
          ¿Ya tienes cuenta? <Link to="/login" className="text-cuba-600 dark:text-cuba-400 hover:underline font-medium">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}