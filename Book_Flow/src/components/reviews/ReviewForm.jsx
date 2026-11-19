import { useId, useState } from 'react';
import FormMessage from '../forms/FormMessage';
import { MAX_COMMENT, newId, validateReview } from '../../service/reviewService';

// Formulario controlado: el estado determina lo que se ve en cada campo.
// Estados: rating, comment y recommend (lo escrito), errors (qué falló) y status (confirmación tras guardar).
export default function ReviewForm({ bookId, author, onAdd }) {
  // Un prefijo por uso del componente; cada campo añade su sufijo. No se usa para claves ni para el id del registro.
  const baseId = useId();
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [recommend, setRecommend] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault(); // cancela el envío tradicional: los datos los gestiona la aplicación
    const found = validateReview({ rating, comment });
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus({ text: 'Revisa los campos marcados. La reseña no se publicó.', ok: false });
      return;
    }
    // El id se crea aquí, al guardar
    onAdd({
      id: newId(), bookId, author, rating: Number(rating),
      comment: comment.trim(), recommend, date: new Date().toISOString(),
    });
    setRating(''); setComment(''); setRecommend(false); // campos listos para otra reseña
    setStatus({ text: 'Reseña publicada.', ok: true });
  };

  return (
    <form className="form review-form" onSubmit={handleSubmit} noValidate>
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
      <button className="btn btn--primary" type="submit">Publicar reseña</button>
    </form>
  );
}
