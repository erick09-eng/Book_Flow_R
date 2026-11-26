/* Recuperar contraseña: código de 6 dígitos enviado por correo (EmailJS) */
import { CONFIG } from './config';
import { users } from './usersService';

export async function sendResetEmail(to, name, code) {
  const c = CONFIG.EMAILJS || {};
  if (!c.serviceId || !c.templateId || !c.publicKey) return { ok: false, error: 'El envío de correos no está configurado (service/config.js).' };
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service_id: c.serviceId, template_id: c.templateId, user_id: c.publicKey, template_params: { to_email: to, to_name: name, code, minutes: 15 } }),
    });
    return res.ok ? { ok: true } : { ok: false, error: 'No se pudo enviar el correo. Intenta de nuevo.' };
  } catch { return { ok: false, error: 'Sin conexión: no se pudo enviar el correo.' }; }
}

export async function sendCode(email) {
  const r = await users.requestReset(email);
  return r.data ? sendResetEmail(email, r.data.name, r.data.code) : { ok: true };
}
