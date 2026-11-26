import { useApp } from '../context/AppContext';
import { useLocale } from './useLocale';
import { loans } from '../service/loanService';
import { favorites } from '../service/favoriteService';

// Formateador de fecha para uso fuera de componentes (fallback a es-ES)
export function fmt(iso, locale = 'es-ES') {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

export function useBookActions() {
  const { user, toast, refresh } = useApp();
  const { formatDate } = useLocale();

  const run = (kind, id) => {
    if (!user) { toast('Inicia sesión para continuar.', false); return; }
    let r;
    if (kind === 'like') { r = favorites.toggle(user.email, id); r.ok && toast(r.data.liked ? 'Añadido a favoritos.' : 'Quitado de favoritos.'); }
    else if (kind === 'loan') { r = loans.request(user.email, id); r.ok && toast('Préstamo creado. Devuélvelo antes del ' + formatDate(r.data.dueDate)); }
    else if (kind === 'renew') { r = loans.renew(id); r.ok && toast('Renovado hasta el ' + formatDate(r.data.dueDate)); }
    else { r = loans.returnBook(id); r.ok && toast('Libro devuelto.'); }
    if (!r.ok) toast(r.error, false);
    refresh();
  };

  return {
    like: (id) => run('like', id),
    loan: (id) => run('loan', id),
    renew: (id) => run('renew', id),
    giveBack: (id) => run('return', id),
  };
}
