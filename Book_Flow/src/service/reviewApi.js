/* Servicio de reseñas contra la API propia (Supabase). Sin Hooks y sin decidir mensajes de pantalla:
   construye la consulta, comprueba la respuesta y devuelve datos con una forma conocida. */
import { supabaseClient as supabase, CONFIG } from './config';

const TABLE = CONFIG.SUPABASE.reviewsTable;
const COLUMNS = 'id,user_id,book_id,author_name,rating,comment,recommend,created_at';
export const MAX_ROWS = 100;

// Contrato de la tabla -> forma que usa la interfaz (único lugar donde se traducen los nombres)
const fromRow = (r) => ({
  id: r.id, userId: r.user_id, bookId: r.book_id, author: r.author_name,
  rating: r.rating, comment: r.comment, recommend: r.recommend, date: r.created_at,
});
const isValidRow = (r) =>
  r && typeof r.id === 'string' && typeof r.comment === 'string' &&
  Number.isInteger(r.rating) && typeof r.author_name === 'string';

// Una escritura sobre cero filas no siempre da error HTTP: .single() la convierte en error y lo traducimos
const friendly = (error) =>
  error.code === 'PGRST116'
    ? 'No se encontró la reseña o no tienes permiso sobre ella.'
    : error.message;

// El filtro de calificación se aplica en la API (eq), antes del límite de filas.
export async function listReviews(bookId, rating, signal) {
  let q = supabase.from(TABLE).select(COLUMNS)
    .eq('book_id', String(bookId))
    .order('created_at', { ascending: false })
    .limit(MAX_ROWS);
  if (rating) q = q.eq('rating', Number(rating));
  const { data, error } = await q.abortSignal(signal);
  if (error) throw new Error(error.message);
  if (!Array.isArray(data)) throw new Error('La API no devolvió una colección válida.');
  if (!data.every(isValidRow)) throw new Error('Hay reseñas con datos incompletos.');
  return data.map(fromRow);
}

// El dueño (user_id) lo comprueba RLS con la sesión; aquí se envía solo para que la intención sea explícita.
export async function createReview(userId, { bookId, author, rating, comment, recommend }) {
  const { data, error } = await supabase.from(TABLE)
    .insert({ user_id: userId, book_id: String(bookId), author_name: author, rating, comment, recommend })
    .select(COLUMNS).single(); // pide la fila persistida con su id generado
  if (error) throw new Error(friendly(error));
  return fromRow(data);
}

// PATCH parcial: solo campos editables, filtrando por id Y por dueño. Nunca se envía user_id en el cuerpo.
export async function updateReview(id, userId, { rating, comment, recommend }) {
  const { data, error } = await supabase.from(TABLE)
    .update({ rating, comment, recommend })
    .eq('id', id).eq('user_id', userId)
    .select(COLUMNS).single();
  if (error) throw new Error(friendly(error));
  return fromRow(data);
}

// Devuelve el id de la única fila eliminada.
export async function deleteReview(id, userId) {
  const { data, error } = await supabase.from(TABLE)
    .delete().eq('id', id).eq('user_id', userId)
    .select('id').single();
  if (error) throw new Error(friendly(error));
  return data.id;
}
