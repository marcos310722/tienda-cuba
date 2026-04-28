import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  // Enlace directo al WhatsApp de la gestora (+54 50 595208)
  const whatsappUrl = "https://wa.me/5350595208";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce-slow group"
      aria-label="Contactar a la gestora de ventas por WhatsApp"
    >
      <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
      
      {/* Tooltip opcional al pasar el mouse */}
      <span className="absolute right-16 bg-white dark:bg-slate-800 text-gray-800 dark:text-white text-xs px-3 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border dark:border-slate-700">
         Chatear con Ventas
      </span>
    </a>
  );
}