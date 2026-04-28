import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Loader2, Lock, CheckCircle } from 'lucide-react';

export default function UpdatePassword() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const password = watch('password', '');

  useEffect(() => {
    // Verificar si hay token de recuperación en la URL
    const hash = window.location.hash;
    if (hash.includes('access_token') || hash.includes('type=recovery')) {
      // Supabase manejará la sesión automáticamente
      console.log('✅ Token de recuperación detectado');
    } else {
      setError('Enlace de recuperación inválido o expirado. Solicita uno nuevo.');
    }
  }, []);

  const onSubmit = async (data) => {
    setError('');
    setMessage('');
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });
      
      if (error) throw error;
      
      setSuccess(true);
      setMessage('✅ Contraseña actualizada correctamente');
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Error al actualizar la contraseña');
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="card w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Contraseña Actualizada!</h2>
          <p className="text-gray-600 mb-4">Serás redirigido al login en unos segundos...</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">Ir al login ahora</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nueva Contraseña</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}
        
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
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
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
            <input 
              type="password" 
              {...register('confirmPassword', { 
                required: 'Campo obligatorio', 
                validate: (v) => v === password || 'Las contraseñas no coinciden' 
              })} 
              className="input" 
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>
          
          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full flex items-center justify-center space-x-2">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Actualizar Contraseña</span>}
          </button>
        </form>
      </div>
    </div>
  );
}