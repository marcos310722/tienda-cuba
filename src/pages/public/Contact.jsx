import { MessageCircle, Send, MessageSquareMore, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-cuba-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
          <User className="w-10 h-10" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Contáctenos
        </h1>
        <p className="text-gray-600 dark:text-slate-400">
          Soporte técnico y desarrollo por <strong className="text-cuba-600 dark:text-cuba-400">Marcos Despaigne</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* WhatsApp Card */}
        <a href="https://wa.me/5355553302" target="_blank" rel="noopener noreferrer" className="card group hover:border-green-300 dark:hover:border-green-800 transition-colors flex flex-col items-center text-center p-6">
          <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
            <MessageCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">WhatsApp</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">+53 55553302</p>
          <span className="text-xs font-medium text-cuba-600 dark:text-cuba-400 bg-cuba-50 dark:bg-cuba-900/20 px-3 py-1 rounded-full">
            Deseo comunicarme con Marcos Despaigne el desarrolador de la página
          </span>
        </a>

        {/* Telegram Card */}
        <a href="https://t.me/5355553302" target="_blank" rel="noopener noreferrer" className="card group hover:border-blue-300 dark:hover:border-blue-800 transition-colors flex flex-col items-center text-center p-6">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <Send className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Telegram</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">@5355553302</p>
          <span className="text-xs font-medium text-cuba-600 dark:text-cuba-400 bg-cuba-50 dark:bg-cuba-900/20 px-3 py-1 rounded-full">
            Deseo comunicarme con Marcos Despaigne el desarrolador de la página
          </span>
        </a>

        {/* Messenger Card */}
        <a href="https://m.me/marcos.despaigne" target="_blank" rel="noopener noreferrer" className="card group hover:border-purple-300 dark:hover:border-purple-800 transition-colors flex flex-col items-center text-center p-6">
          <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
            <MessageSquareMore className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Messenger</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Marcos Despaigne</p>
          <span className="text-xs font-medium text-cuba-600 dark:text-cuba-400 bg-cuba-50 dark:bg-cuba-900/20 px-3 py-1 rounded-full">
            Deseo comunicarme con Marcos Despaigne el desarrolador de la página
          </span>
        </a>
      </div>

      <div className="text-center">
        <Link to="/" className="btn btn-secondary">Volver al Inicio</Link>
      </div>
    </div>
  );
}