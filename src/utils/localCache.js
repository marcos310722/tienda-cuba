const CACHE_KEY = 'tienda-cuba-products-cache';
const TTL = 10 * 60 * 1000; // 10 minutos

export const saveToCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
};

export const getFromCache = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (!cached || Date.now() - cached.timestamp > TTL) return null;
    return cached.data;
  } catch { return null; }
};