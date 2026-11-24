import './reviews.css';
import { useId, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToggle } from '../../hooks/useToggle';
import { useReviews } from '../../hooks/useReviews';
import { useSupabaseSession } from '../../hooks/useSupabaseSession';
import { fmt } from '../../hooks/useBookActions';
import { MAX_ROWS, deleteReview } from '../../service/reviewApi';
import { averageRating, filterReviews } from '../../service/reviewService';
import ReviewForm from './ReviewForm';
import ReviewFilter from './ReviewFilter';

// Panel de reseñas de un libro. Se abre y se cierra con useToggle.
// El cuerpo (ReviewsBody) solo existe mientras el panel está abierto: así la lectura a la API
// se prepara al abrir y su limpieza cancela la petición al cerrar.
export default function ReviewsPanel({ book }) {
  const panelId = useId();
  const panel = useToggle(false);
  return (
    <section className="reviews">
      <button className="btn btn--ghost" type="button" aria-expanded={panel.value} aria-controls={panelId} onClick={panel.toggle}>
        {panel.value ? 'Ocultar reseñas' : 'Ver reseñas'}
      </button>
      {panel.value && <ReviewsBody id={panelId} book={book} />}
    </section>
  );
}

function ReviewsBody({ id, book }) {
  const { user, openModal } = useApp();
  const session = useSupabaseSession();           // sesión de Supabase Auth (la que evalúa RLS)
  const filters = useToggle(false);
  const [rating, setRating] = useState('');       // criterio remoto: viaja a la API
  const [text, setText] = useState('');           // criterio local: solo sobre lo descargado
  const [editing, setEditing] = useState(null);   // reseña en edición (se identifica por id)
  const [busy, setBusy] = useState(false);        // hay una escritura pendiente
  const [message, setMessage] = useState('');     // confirmación de la ESCRITURA (distinta del error de lectura)
  const [actionError, setActionError] = useState('');

  const { filas, cargando, error, recargar } = useReviews(book.id, rating);
  const results = filterReviews(filas, { text });       // derivados: no son estado
  const average = averageRating(filas);
  const myId = session?.user?.id;
  const author = user?.name || session?.user?.user_metadata?.full_name || 'Lector';
  const clearFilters = () => { setRating(''); setText(''); };

  const handleSaved = (row, texto) => {
    setMessage(`${texto}. Identificador: ${row.id}`);
    setActionError('');
    setEditing(null);
    recargar(); // la lista vuelve a pedirse a la API (con el filtro actual)
  };

  const handleDelete = async (r) => {
    if (busy || !window.confirm(`¿Eliminar tu reseña de ${r.rating} estrellas?`)) return;
    setBusy(true); setMessage(''); setActionError('');
    try {
      const deletedId = await deleteReview(r.id, myId);
      setMessage(`Eliminación confirmada: ${deletedId}`);
      if (editing?.id === deletedId) setEditing(null);
      recargar();
    } catch (e) {
      setActionError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div id={id} className="reviews__body">
      <h3>Reseñas de lectores</h3>

      {session === undefined ? null : session ? (
        <ReviewForm
          key={editing?.id ?? 'nueva'}
          bookId={book.id} userId={myId} author={author}
          editing={editing} busy={busy} setBusy={setBusy}
          onSaved={handleSaved} onCancel={() => setEditing(null)}
        />
      ) : user ? (
        <p className="muted">Para publicar reseñas guardadas en la nube, entra con Google (Cerrar sesión y volver a entrar con Google).</p>
      ) : (
        <p className="muted">
          Inicia sesión con Google para escribir una reseña.{' '}
          <button className="link" type="button" onClick={() => openModal('auth')}>Iniciar sesión</button>
        </p>
      )}

      {message && <p className="msg msg--ok" role="status">{message}</p>}
      {actionError && <p className="msg msg--err" role="alert">{actionError}</p>}

      <button className="btn btn--ghost" type="button" aria-expanded={filters.value} onClick={filters.toggle}>
        {filters.value ? 'Ocultar filtros' : 'Filtrar reseñas'}
      </button>
      {filters.value && (
        <ReviewFilter text={text} rating={rating} onText={setText} onRating={setRating} onClear={clearFilters} />
      )}

      {/* No se anuncia "sin reseñas" mientras la lectura siga pendiente */}
      {cargando && <p className="muted" role="status">Cargando reseñas...</p>}
      {!cargando && error && (
        <div role="alert">
          <p className="msg msg--err">No se pudo consultar: {error}</p>
          <button className="btn btn--ghost" type="button" onClick={recargar} disabled={busy}>Reintentar consulta</button>
        </div>
      )}
      {!cargando && !error && (
        <>
          <p className="muted" role="status">
            {filas.length === 0
              ? (rating ? `No hay reseñas de ${rating} estrellas para este libro.` : 'Aún no hay reseñas de este libro. Escribe la primera.')
              : `${results.length} visibles de ${filas.length} cargadas${filas.length === MAX_ROWS ? ` (máximo ${MAX_ROWS})` : ''} · Promedio de las cargadas: ★ ${average.toFixed(1)}`}
          </p>
          {filas.length > 0 && results.length === 0 && (
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
                  {myId && r.userId === myId && (
                    <div className="review-filter__actions">
                      <button className="btn btn--ghost" type="button" disabled={busy} onClick={() => { setEditing(r); setMessage(''); setActionError(''); }}>Editar</button>
                      <button className="btn btn--ghost" type="button" disabled={busy} onClick={() => handleDelete(r)}>Eliminar</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
