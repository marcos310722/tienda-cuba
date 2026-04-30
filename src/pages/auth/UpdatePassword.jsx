import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Loader2, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export default function UpdatePassword() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const password = watch('password', '');

  useEffect(() => {
    const verifyRecovery = async () => {
      const hash = window.location.hash;
      
      if (!hash.includes('access_token') || !hash.includes('type=recovery')) {
        setError('Enlace de recuperación inválido o expirado. Solicita uno nuevo.');
        return;
      }

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          setError('Sesión no válida. Por favor, solicita un nuevo enlace de recuperación.');
          return;
        }

        const userType = session.user.aud;
        if (userType !== 'authenticated') {
          setError('Token de recuperación inválido.');
          return;
        }

        setUserEmail(session.user.email || '');
        console.log('✅ Token válido para:', session.user.email);
        
      } catch (err) {
        setError('Error al verificar el enlace: ' + err.message);
      }
    };

    verifyRecovery();
  }, []);

  const onSubmit = async (data) => {
    setError('');
    setMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No hay sesión activa. El enlace puede haber expirado.');
      }

      const { error } = await supabase.auth.updateUser({
        password: data.password
      });
      
      if (error) throw error;
      
      setSuccess(true);
      setMessage('✅ Contraseña actualizada correctamente');
      
      setTimeout(() => {
        supabase.auth.signOut();
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Error al actualizar la contraseña');
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 py-12">
        <div className="card w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">¡Contraseña Actualizada!</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-4">Serás redirigido al login en unos segundos...</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">Ir al login ahora</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 py-12">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Nueva Contraseña</h2>
        
        {userEmail && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm border border-blue-200 dark:border-blue-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Recuperando cuenta: <strong>{userEmail}</strong></span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm border border-green-200 dark:border-green-800">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Nueva contraseña
            </label>
            <input 
              type="password" 
              {...register('password', { 
                required: 'Campo obligatorio', 
                minLength: { value: 6, message: 'Mínimo 6 caracteres' } 
              })} 
              className="input" 
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Confirmar contraseña</label>
            <input 
              type="password" 
              {...register('confirmPassword', { 
                required: 'Campo obligatorio', 
                validate: (v) => v === password || 'Las contraseñas no coinciden' 
              })} 
              className="input" 
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>}
          </div>
          
          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full flex items-center justify-center space-x-2">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Actualizar Contraseña</span>}
          </button>
        </form>
      </div>
    </div>
  );
}