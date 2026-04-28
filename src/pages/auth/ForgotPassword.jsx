import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    setError('');
    setMessage('');
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/recuperar-contrasena/nueva`,
      });
      
      if (error) throw error;
      
      setSent(true);
      setMessage('✅ Si el correo existe, recibirás instrucciones para restablecer tu contraseña.');
    } catch (err) {
      setError(err.message || 'Error al solicitar restablecimiento');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="card w-full max-w-md">
        <Link to="/login" className="inline-flex items-center text-sm text-cuba-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Volver al login
        </Link>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Olvidaste tu contraseña?</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Ingresa tu correo y te enviaremos instrucciones para crear una nueva contraseña.
        </p>

        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        {!sent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input 
                type="email" 
                {...register('email', { 
                  required: 'Campo obligatorio', 
                  pattern: { value: /^\S+@\S+$/i, message: 'Correo inválido' } 
                })} 
                className="input" 
                placeholder="tu@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            
            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full flex items-center justify-center space-x-2">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Mail className="w-4 h-4" /> <span>Enviar instrucciones</span></>}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-4xl">📧</div>
            <p className="text-gray-600 text-sm">
              Revisa tu bandeja de entrada (y spam). El enlace expira en 1 hora.
            </p>
            <p className="text-xs text-gray-500 bg-amber-50 p-2 rounded border border-amber-200">
              💡 ¿No recibiste el correo? En Cuba el email puede tardar. 
              Contacta al admin por WhatsApp para restablecimiento manual.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}