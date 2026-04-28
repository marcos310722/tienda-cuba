import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        });
      },
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          return set((state) => ({
            items: state.items.filter((i) => i.id !== id),
          }));
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
      },
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price_cup * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { 
      name: 'tienda-cuba-cart',
      // Migración para limpiar carritos antiguos
      migrate: (persistedState, version) => {
        // En futuras versiones puedes migrar datos
        return persistedState;
      }
    }
  )
);

// Función para limpiar carrito al cambiar de usuario
export const clearCartForUser = () => {
  useCart.getState().clearCart();
};