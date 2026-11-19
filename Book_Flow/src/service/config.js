/* Configuración de servicios externos. */
import { createClient } from '@supabase/supabase-js';

export const CONFIG = {
  // Inicio de sesión con Google: ID de cliente OAuth tipo "Aplicación web"
  // Debes obtenerlo en https://console.cloud.google.com/ (APIs y servicios > Credenciales)
  GOOGLE_CLIENT_ID: '647541497777-0v0fvcaab6c3hkjunra4jibgpm3lknu5.apps.googleusercontent.com',

  // Envío de correos para recuperar la contraseña (EmailJS)
  EMAILJS: {
    serviceId: '',                 // ej: 'service_xxxxxxx'
    templateId: '',                // ej: 'template_xxxxxxx'
    publicKey: '',                 // ej: 'AbCdEfGhIjKlMnOp'
  },

  // Configuración de Supabase
  SUPABASE: {
    // Clase 4: se leen de .env.local (ver .env.example). Si no existe, se usan los valores del segundo corte.
    url: import.meta.env.VITE_SUPABASE_URL || 'https://bdjwpdwlheocnenszprh.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_XeMvR31qNv_JNiwoD_Rr5w_47Lresro',
    reviewsTable: import.meta.env.VITE_TABLA_RESENAS || 'reviews',
  },
};

// Cliente de Supabase (ahora viene del paquete npm en vez del CDN)
export const supabaseClient = createClient(CONFIG.SUPABASE.url, CONFIG.SUPABASE.anonKey);
