/* "Me gusta" / Guardados. */
import { storage, ok } from './storage';
import { books } from './bookService';
import { supabase } from './supabaseService';

const KEY = 'favorites';
const all = () => storage.get(KEY, {});

export const favorites = {
  ids: (email) => all()[email] || [],
  isLiked: (email, id) => favorites.ids(email).includes(Number(id)),
  toggle(email, id) {
    const data = all();
    const set = new Set(data[email] || []);
    const liked = !set.has(Number(id));
    liked ? set.add(Number(id)) : set.delete(Number(id));
    data[email] = [...set];
    storage.set(KEY, data);

    // Replicar favorito en Supabase (no bloqueante)
    if (supabase.isReady) {
      liked
        ? supabase.insertFavorite(email, id).catch(() => {})
        : supabase.removeFavorite(email, id).catch(() => {});
    }

    return ok({ liked });
  },
  list: (email) => favorites.ids(email).map((id) => books.get(id)).filter(Boolean),
  count: (id) => Object.values(all()).filter((ids) => ids.includes(Number(id))).length,
  removeAllForUser(email) { const d = all(); delete d[email]; storage.set(KEY, d); },
};
