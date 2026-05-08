const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutos

export const saveToCache = (data, key = 'tienda-cuba-products-cache', ttl = DEFAULT_TTL) => {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now(), ttl }));
  } catch (error) {
    console.warn('Error saving to cache:', error);
  }
};

export const getFromCache = (key = 'tienda-cuba-products-cache', ttl = DEFAULT_TTL) => {
  try {
    const cached = JSON.parse(localStorage.getItem(key));
    if (!cached || Date.now() - cached.timestamp > (cached.ttl || ttl)) {
      localStorage.removeItem(key);
      return null;
    }
    return cached.data;
  } catch (error) {
    console.warn('Error reading from cache:', error);
    return null;
  }
};

export const clearCache = (key) => {
  try {
    if (key) {
      localStorage.removeItem(key);
    } else {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('tienda-cuba-')) {
          localStorage.removeItem(k);
        }
      });
    }
  } catch (error) {
    console.warn('Error clearing cache:', error);
  }
};
