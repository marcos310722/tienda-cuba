import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno de Supabase');
}

// Singleton pattern - una sola instancia del cliente
let supabaseInstance = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { 
        autoRefreshToken: true, 
        persistSession: true, 
        detectSessionInUrl: false,
        flowType: 'pkce'
      },
      global: {
        headers: { 'X-Client-Info': 'tienda-cuba/1.0.0' }
      },
      db: {
        schema: 'public'
      }
    });
  }
  return supabaseInstance;
};

export const supabase = getSupabaseClient();
