/* Inicio de sesión con Google (Google Identity Services) */
import { CONFIG } from './config';

export const decodeJwt = (t) => {
  const b = t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(decodeURIComponent(atob(b).split('').map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')));
};

// Google solo permite inicializar una vez; el callback apunta siempre al último manejador registrado
let handler = null;
export const setGoogleHandler = (fn) => { handler = fn; };

let gReady = null;
export function loadGoogle() {
  if (gReady) return gReady;
  gReady = new Promise((res, rej) => {
    const sc = document.createElement('script');
    sc.src = 'https://accounts.google.com/gsi/client'; sc.async = true;
    sc.onload = () => { window.google.accounts.id.initialize({ client_id: CONFIG.GOOGLE_CLIENT_ID, callback: (r) => handler && handler(r) }); res(); };
    sc.onerror = () => { gReady = null; rej(new Error('No se pudo cargar Google')); };
    document.head.appendChild(sc);
  });
  return gReady;
}
