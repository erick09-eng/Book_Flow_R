import { useId, useState } from 'react';
import FormMessage from '../forms/FormMessage';
import { MAX_COMMENT, validateReview } from '../../service/reviewService';
import { createReview, updateReview } from '../../service/reviewApi';

// Formulario controlado de crear / editar. El modo depende de `editing` (null = crear), no de una posición en la lista.
// La validación y la escritura ocurren en el manejador del envío (un evento), nunca en un efecto.
// El padre le pone key={editing?.id ?? 'nueva'} para que cambiar de reseña reinicie los campos.
export default function ReviewForm({ bookId, userId, author, editing, busy, setBusy, onSaved, onCancel }) {
  const baseId = useId();
  const [rating, setRating] = useState(editing ? String(editing.rating) : '');
  const [comment, setComment] = useState(editing ? editing.comment : '');
  const [recommend, setRecommend] = useState(editing ? editing.recommend : false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy) return; // acción repetida mientras hay una escritura pendiente
    const found = validateReview({ rating, comment });
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus({ text: 'Revisa los campos marcados. La reseña no se guardó.', ok: false });
      return;
    }
    const values = { rating: Number(rating), comment: comment.trim(), recommend };
    setBusy(true);
    setStatus(null);
    try {
      const row = editing
        ? await updateReview(editing.id, userId, values)
        : await createReview(userId, { bookId, author, ...values });
      // Solo tras la respuesta de la API se confirma, con el id que devolvió la base
      onSaved(row, editing ? 'Reseña actualizada' : 'Reseña publicada');
      if (!editing) { setRating(''); setComment(''); setRecommend(false); }
    } catch (error) {
      setStatus({ text: error.message, ok: false }); // el contenido escrito se conserva
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form review-form" onSubmit={handleSubmit} noValidate>
      <h4>{editing ? 'Editar reseña' : 'Escribe una reseña'}</h4>
      <fieldset className="review-fieldset" disabled={busy}>
        <div className="field">
          <label htmlFor={baseId + '-rating'}>Calificación</label>
          <select
            id={baseId + '-rating'} name="rating" value={rating}
            onChange={(e) => setRating(e.target.value)}
            aria-invalid={Boolean(errors.rating)}
            aria-describedby={errors.rating ? baseId + '-rating-error' : undefined}
          >
            <option value="">Elige una opción</option>
            <option value="5">5 · Excelente</option>
            <option value="4">4 · Muy bueno</option>
            <option value="3">3 · Bueno</option>
            <option value="2">2 · Regular</option>
            <option value="1">1 · Malo</option>
          </select>
          {errors.rating && <p id={baseId + '-rating-error'} className="msg msg--err" role="alert">{errors.rating}</p>}
        </div>

        <div className="field">
          <label htmlFor={baseId + '-comment'}>Comentario</label>
          <textarea
            id={baseId + '-comment'} name="comment" rows={3} maxLength={MAX_COMMENT + 50}
            value={comment} onChange={(e) => setComment(e.target.value)}
            aria-invalid={Boolean(errors.comment)}
            aria-describedby={errors.comment ? baseId + '-comment-error' : baseId + '-comment-help'}
          />
          <p id={baseId + '-comment-help'} className="muted review-help">{comment.trim().length} / {MAX_COMMENT} caracteres</p>
          {errors.comment && <p id={baseId + '-comment-error'} className="msg msg--err" role="alert">{errors.comment}</p>}
        </div>

        <label className="review-check" htmlFor={baseId + '-recommend'}>
          <input
            id={baseId + '-recommend'} name="recommend" type="checkbox"
            checked={recommend} onChange={(e) => setRecommend(e.target.checked)}
          />
          Recomiendo este libro
        </label>

        <FormMessage msg={status} />
        <div className="review-filter__actions">
          <button className="btn btn--primary" type="submit">
            {busy ? 'Procesando...' : editing ? 'Guardar cambios' : 'Publicar reseña'}
          </button>
          {editing && <button className="btn btn--ghost" type="button" onClick={onCancel}>Cancelar edición</button>}
        </div>
      </fieldset>
    </form>
  );
}
