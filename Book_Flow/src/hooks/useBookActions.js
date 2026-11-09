import { useApp } from '../context/AppContext';
import { loans } from '../service/loanService';
import { favorites } from '../service/favoriteService';
import { books } from '../service/bookService';

const fmt = (iso) => new Date(iso).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });

/* Acciones sobre un libro: ver, favorito, préstamo, renovar y devolver.
   Antes eran un único listener de clics en app.js (data-view, data-like, data-loan...). */
export function useBookActions() {
  const { user, toast, openModal, refresh } = useApp();

  const run = (kind, id) => {
    if (!user) { toast('Inicia sesión para continuar.', false); return openModal('auth'); }
    let r;
    if (kind === 'like') { r = favorites.toggle(user.email, id); r.ok && toast(r.data.liked ? 'Añadido a favoritos.' : 'Quitado de favoritos.'); }
    else if (kind === 'loan') { r = loans.request(user.email, id); r.ok && toast('Préstamo creado. Devuélvelo antes del ' + fmt(r.data.dueDate)); }
    else if (kind === 'renew') { r = loans.renew(id); r.ok && toast('Renovado hasta el ' + fmt(r.data.dueDate)); }
    else { r = loans.returnBook(id); r.ok && toast('Libro devuelto.'); }
    if (!r.ok) toast(r.error, false);
    refresh();
  };

  return {
    view: (id) => { if (books.get(id)) openModal('book', { id }); },
    like: (id) => run('like', id),
    loan: (id) => run('loan', id),
    renew: (id) => run('renew', id),
    giveBack: (id) => run('return', id),
  };
}

export { fmt };
