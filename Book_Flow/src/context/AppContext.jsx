import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { users } from '../service/usersService';
import { supabaseClient } from '../service/config';

/* Estado compartido de la app: sesión, ventana emergente (modal) y aviso (toast).
   Reemplaza al antiguo `user`, `openModal`, `closeModal`, `toast` y `rerender` de app.js. */
const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => users.current());
  const [tick, setTick] = useState(0);          // se incrementa para volver a pintar tras cambios en localStorage
  const [modal, setModal] = useState(null);     // { type, key, ...props }
  const [toastState, setToastState] = useState({ text: '', ok: true, on: false });
  const toastTimer = useRef(null);
  const modalKey = useRef(0);

  const refresh = useCallback(() => { setUser(users.current()); setTick((t) => t + 1); }, []);

  const toast = useCallback((text, ok = true) => {
    setToastState({ text, ok, on: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState((s) => ({ ...s, on: false })), 3200);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // openModal reemplaza cualquier ventana abierta, igual que antes
  const openModal = useCallback((type, props = {}) => setModal({ type, key: ++modalKey.current, ...props }), []);
  const closeModal = useCallback(() => setModal(null), []);

  // Tras iniciar sesión o registrarse se entra al perfil
  const signedIn = useCallback(() => { setModal(null); refresh(); navigate('/cuenta'); }, [refresh, navigate]);
  // Tras cerrar sesión o eliminar la cuenta se vuelve al inicio
  const signedOut = useCallback(() => {
    supabaseClient.auth.signOut().catch(() => {}); // cierra también la sesión de Supabase (reseñas)
    setModal(null); navigate('/'); refresh();
  }, [refresh, navigate]);

  const value = useMemo(() => ({
    user, tick, modal, toastState, refresh, toast, openModal, closeModal, signedIn, signedOut,
    openBook: modal?.type === 'book' ? modal.id : null,
  }), [user, tick, modal, toastState, refresh, toast, openModal, closeModal, signedIn, signedOut]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
