export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'media', // 👈 ESTO ACTIVA EL MODO AUTOMÁTICO POR SISTEMA
  theme: {
    extend: {
      colors: {
        cuba: { 500: '#002868', 600: '#001b44' }
      }
    },
  },
  plugins: [],
}