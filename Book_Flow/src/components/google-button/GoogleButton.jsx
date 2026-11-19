import { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CONFIG } from '../../service/config';
import { users } from '../../service/usersService';
import { supabase } from '../../service/supabaseService';
import { decodeJwt, loadGoogle, setGoogleHandler } from '../../service/googleService';

// Botón "Continuar con Google" (el contenedor conserva el id que usaba el HTML original)
export default function GoogleButton({ id }) {
  const { toast, signedIn } = useApp();
  const ref = useRef(null);
  // Siempre se usa la versión más reciente de toast/signedIn sin volver a dibujar el botón de Google
  const latest = useRef({ toast, signedIn });
  latest.current = { toast, signedIn };

  useEffect(() => {
    const toast = (...a) => latest.current.toast(...a);
    const signedIn = () => latest.current.signedIn();
    const el = ref.current;
    if (!el) return undefined;
    let cancelled = false;

    function onGoogle({ credential }) {
      try {
        const p = decodeJwt(credential);
        if (p.email_verified === false) return toast('Tu correo de Google no está verificado.', false);
        const r = users.loginWithGoogle({ name: p.name, email: p.email });
        if (r.ok) {
          // Replicar perfil de Google en Supabase (no bloqueante)
          if (supabase.isReady) {
            supabase.upsertProfile({ email: p.email, name: p.name, since: new Date().toISOString(), google: true }).catch(() => {});
          }
          signedIn();
        } else toast(r.error, false);
      } catch { toast('No se pudo iniciar sesión con Google.', false); }
    }

    if (!CONFIG.GOOGLE_CLIENT_ID) {
      el.innerHTML = '<button type="button" class="btn btn--ghost btn--block">Continuar con Google</button>';
      el.querySelector('button').addEventListener('click', () => toast('Falta configurar GOOGLE_CLIENT_ID en service/config.js', false));
      return () => { el.innerHTML = ''; };
    }

    setGoogleHandler(onGoogle);
    loadGoogle()
      .then(() => {
        if (cancelled) return;
        el.innerHTML = '';
        window.google.accounts.id.renderButton(el, { theme: 'filled_black', size: 'large', text: 'continue_with', shape: 'rectangular', width: 320 });
      })
      .catch(() => { if (!cancelled) el.innerHTML = '<p class="muted">No se pudo cargar Google. Revisa tu conexión.</p>'; });

    return () => { cancelled = true; el.innerHTML = ''; };
  }, []);

  return <div className="google-slot" id={id} ref={ref}></div>;
}
