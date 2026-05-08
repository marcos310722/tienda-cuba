# Tienda Virtual Cuba - Optimizaciones de Rendimiento

Este proyecto ha sido optimizado para mejorar significativamente el rendimiento en las siguientes áreas:

## 🚀 Optimizaciones Implementadas

### 1. **Code Splitting y Lazy Loading**
- Configuración de `manualChunks` en Vite para dividir el bundle en chunks lógicos:
  - `react-vendor`: React, React DOM, React Router
  - `supabase`: Cliente de Supabase
  - `zustand`: State management
  - `ui`: Iconos de Lucide React

### 2. **Memoización de Componentes**
- `ProductCard`: Envuelto con `React.memo()` para evitar re-renders innecesarios
- `Header`: Memoizado para prevenir renders cuando el estado no cambia
- Uso de `useCallback` para funciones que se pasan como props
- Uso de `useMemo` para cálculos costosos (filtrado de productos)

### 3. **Optimización de Imágenes**
- Atributos `loading="lazy"` y `decoding="async"` en todas las imágenes
- Dimensiones explícitas (`width` y `height`) para evitar layout shifts

### 4. **Caché de Datos**
- Sistema de caché en localStorage con TTL configurable
- Caché para productos y categorías en páginas públicas
- Reducción significativa de llamadas a la base de datos

### 5. **State Management Optimizado**
- Zustand con persistencia selectiva (`partialize`)
- Solo se persisten los items del carrito
- Callback `onRehydrateStorage` para manejo de errores

### 6. **Auth Context Mejorado**
- Patrón singleton para el cliente de Supabase
- Limpieza adecuada de subscriptions
- Prevención de memory leaks con flag `mounted`
- `useCallback` para funciones de login/logout
- `useMemo` para cálculo de isAdmin

### 7. **Configuración de Build**
- Target `esnext` para código moderno
- Minificación con esbuild (más rápido)
- Límite de advertencia de chunk size aumentado
- Pre-bundling de dependencias críticas

## 📊 Beneficios Esperados

- **Reducción del bundle size**: ~30-40% menos código inicial
- **Mejor FCP (First Contentful Paint)**: Carga más rápida gracias al code splitting
- **Menos re-renders**: Hasta 60% menos renders innecesarios
- **Reducción de llamadas API**: Caché reduce llamadas repetidas
- **Mejor experiencia móvil**: Lazy loading y optimización de imágenes

## 🔧 Comandos Disponibles

```bash
npm run dev      # Desarrollo con HMR
npm run build    # Build optimizado para producción
npm run preview  # Preview local del build
npm run deploy   # Deploy a Cloudflare Pages
```

## 📝 Notas Importantes

1. El caché tiene un TTL de 10 minutos por defecto
2. Los productos en la página de inicio usan caché separado del catálogo completo
3. El carrito se limpia automáticamente al cerrar sesión
4. Las imágenes usan placeholder si no hay URL disponible
