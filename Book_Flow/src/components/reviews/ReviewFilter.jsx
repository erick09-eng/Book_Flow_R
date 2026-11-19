import { useId } from 'react';

// Dos criterios con destinos distintos:
//  - rating: se envía a la API (cambia el estado del padre -> el Hook vuelve a consultar).
//  - text: búsqueda LOCAL, solo sobre las reseñas ya descargadas.
export default function ReviewFilter({ text, rating, onText, onRating, onClear }) {
  const id = useId();
  return (
    <form className="review-filter" onSubmit={(e) => e.preventDefault()}>
      <div className="field">
        <label htmlFor={id + '-rating'}>Calificación (se consulta en la API)</label>
        <select id={id + '-rating'} name="rating" value={rating} onChange={(e) => onRating(e.target.value)}>
          <option value="">Todas</option>
          <option value="5">5 estrellas</option>
          <option value="4">4 estrellas</option>
          <option value="3">3 estrellas</option>
          <option value="2">2 estrellas</option>
          <option value="1">1 estrella</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor={id + '-text'}>Buscar en las reseñas cargadas</label>
        <input id={id + '-text'} name="search" type="search" value={text} onChange={(e) => onText(e.target.value)} />
      </div>
      <div className="review-filter__actions">
        <button className="btn btn--ghost" type="button" onClick={onClear}>Limpiar filtros</button>
      </div>
    </form>
  );
}
