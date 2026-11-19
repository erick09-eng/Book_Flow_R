import './reviews.css';
import { useId, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToggle } from '../../hooks/useToggle';
import { fmt } from '../../hooks/useBookActions';
import { averageRating, filterReviews } from '../../service/reviewService';
import ReviewForm from './ReviewForm';
import ReviewFilter from './ReviewFilter';

// Panel de reseñas de un libro. Se abre y se cierra con useToggle.
//  - Los registros viven en AppContext (el modal se desmonta al cerrarse y no debe perderlos).
//  - Los criterios de búsqueda viven aquí: el formulario de filtro y la lista los necesitan a ambos.
//  - Resultado, cantidad y promedio se calculan en cada renderizado; no son estado.
export default function ReviewsPanel({ book }) {
  const { user, reviews, addReview, openModal } = useApp();
  const panelId = useId();
  const panel = useToggle(false);   // cada llamada guarda su propio valor
  const filters = useToggle(false);
  const [text, setText] = useState('');
  const [criteria, setCriteria] = useState({ rating: '' });

  const bookReviews = reviews.filter((r) => r.bookId === book.id);
  const results = filterReviews(bookReviews, { text, rating: criteria.rating }).reverse(); // más recientes primero
  const average = averageRating(bookReviews);
  const clearFilters = () => { setText(''); setCriteria({ rating: '' }); };

  return (
    <section className="reviews">
      <button
        className="btn btn--ghost" type="button"
        aria-expanded={panel.value} aria-controls={panelId}
        onClick={panel.toggle}
      >
        {panel.value ? 'Ocultar reseñas' : `Ver reseñas (${bookReviews.length})`}
      </button>

      {panel.value && (
        <div id={panelId} className="reviews__body">
          <h3>Reseñas de lectores</h3>
          {bookReviews.length > 0 && (
            <p className="muted" role="status">Promedio de lectores: ★ {average.toFixed(1)} · {bookReviews.length} {bookReviews.length === 1 ? 'reseña' : 'reseñas'}</p>
          )}

          {user ? (
            <ReviewForm bookId={book.id} author={user.name} onAdd={addReview} />
          ) : (
            <p className="muted">
              Inicia sesión para escribir una reseña.{' '}
              <button className="link" type="button" onClick={() => openModal('auth')}>Iniciar sesión</button>
            </p>
          )}

          {bookReviews.length > 0 && (
            <button className="btn btn--ghost" type="button" aria-expanded={filters.value} onClick={filters.toggle}>
              {filters.value ? 'Ocultar filtros' : 'Filtrar reseñas'}
            </button>
          )}
          {bookReviews.length > 0 && filters.value && (
            <ReviewFilter text={text} onChangeText={setText} onFilter={setCriteria} onClear={clearFilters} />
          )}

          {bookReviews.length === 0 && <p className="muted">Aún no hay reseñas de este libro. Escribe la primera.</p>}
          {bookReviews.length > 0 && results.length === 0 && (
            <p className="muted">
              Ninguna reseña coincide con la búsqueda.{' '}
              <button className="link" type="button" onClick={clearFilters}>Mostrar todas</button>
            </p>
          )}
          {results.length > 0 && (
            <ul className="reviews__list">
              {results.map((r) => (
                <li key={r.id} className="review">
                  <p><strong>{r.author}</strong> <span className="muted">· ★ {r.rating} · {fmt(r.date)}</span></p>
                  <p>{r.comment}</p>
                  {r.recommend && <span className="tag">Lo recomienda</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
