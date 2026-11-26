import { useEffect, useState } from 'react';
import { supabaseClient } from '../service/config';

// undefined = comprobando; null = sin sesión; objeto = con sesión de Supabase Auth.
// La sesión se escucha en un efecto (sistema externo) y la suscripción se retira al desmontar.
export function useSupabaseSession() {
  const [session, setSession] = useState(undefined);
  useEffect(() => {
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_evento, actual) => setSession(actual));
    return () => subscription.unsubscribe();
  }, []);
  return session;
}
