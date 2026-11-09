/* Reglas y cálculos de las reseñas. Son funciones puras (no usan Hooks ni guardan estado):
   los registros viven en AppContext y aquí solo se validan, filtran y resumen. */

// El identificador se crea al guardar, nunca al renderizar.
// crypto.randomUUID solo existe en contextos seguros (https o localhost); en la red local hace falta una alternativa.
export const newId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `r-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const MIN_COMMENT = 10;
export const MAX_COMMENT = 300;

// Devuelve un objeto con el mensaje de cada campo inválido (vacío si todo está bien)
export function validateReview({ rating, comment }) {
  const errors = {};
  const n = Number(rating);
  if (!rating || !Number.isInteger(n) || n < 1 || n > 5) errors.rating = 'Elige una calificación de 1 a 5.';
  const texto = comment.trim(); // un texto de solo espacios sigue estando vacío
  if (texto.length === 0) errors.comment = 'Escribe un comentario.';
  else if (texto.length < MIN_COMMENT) errors.comment = `El comentario necesita al menos ${MIN_COMMENT} caracteres (tiene ${texto.length}).`;
  else if (texto.length > MAX_COMMENT) errors.comment = `El comentario no puede superar ${MAX_COMMENT} caracteres.`;
  return errors;
}

// Un criterio vacío permite cualquier valor; los registros originales no se modifican
export function filterReviews(reviews, { text = '', rating = '' }) {
  const t = text.trim().toLowerCase();
  return reviews.filter((r) =>
    (!rating || r.rating === Number(rating)) &&
    (r.comment.toLowerCase().includes(t) || r.author.toLowerCase().includes(t))
  );
}

// Dato derivado: se calcula desde los registros, no se guarda como estado aparte
export const averageRating = (reviews) =>
  reviews.length === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
