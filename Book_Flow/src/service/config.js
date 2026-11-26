/* Configuración de servicios externos. Lee de import.meta.env (Vite inyecta .env.local). */
import { createClient } from '@supabase/supabase-js';

function requiredEnv(key) {
  const val = import.meta.env[key];
  if (!val) console.warn(`[Config] Variable de entorno faltante: ${key}`);
  return val;
}

export const CONFIG = {
  // Google OAuth: ID de cliente tipo "Aplicación web" (https://console.cloud.google.com/)
  GOOGLE_CLIENT_ID: requiredEnv('VITE_GOOGLE_CLIENT_ID'),

  // EmailJS para recuperación de contraseña (opcional)
  EMAILJS: {
    serviceId: requiredEnv('VITE_EMAILJS_SERVICE_ID') || '',
    templateId: requiredEnv('VITE_EMAILJS_TEMPLATE_ID') || '',
    publicKey: requiredEnv('VITE_EMAILJS_PUBLIC_KEY') || '',
  },

  // Supabase (reseñas con RLS)
  SUPABASE: {
    url: requiredEnv('VITE_SUPABASE_URL'),
    anonKey: requiredEnv('VITE_SUPABASE_PUBLISHABLE_KEY'),
    reviewsTable: requiredEnv('VITE_TABLA_RESENAS') || 'reviews',
  },
};

// Cliente de Supabase
export const supabaseClient = CONFIG.SUPABASE.url && CONFIG.SUPABASE.anonKey
  ? createClient(CONFIG.SUPABASE.url, CONFIG.SUPABASE.anonKey)
  : null;