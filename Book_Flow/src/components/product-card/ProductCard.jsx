import './product-card.css';
import { useApp } from '../../context/AppContext';
import { useBookActions } from '../../hooks/useBookActions';
import { loans } from '../../service/loanService';
import { favorites } from '../../service/favoriteService';

// Tarjeta de libro (nombre + imagen + "Ver libro" + favorito)
export default function ProductCard({ book: b, note = '' }) {
  const { user } = useApp();
  const actions = useBookActions();
  const av = loans.availableCopies(b) > 0;
  const liked = user && favorites.isLiked(user.email, b.id);

  return (
    <article className="card">
      <div className="card__cover" style={{ backgroundImage: b.cover }}>
        <span className={'badge ' + (av ? 'badge--ok' : 'badge--warn')}>{av ? 'Disponible' : 'En préstamo'}</span>
      </div>
      <h3 className="card__title">{b.title}</h3>
      <p className="muted">{b.author} · ★ {b.rating}</p>
      {note && <p className="muted">{note}</p>}
      <div className="card__actions">
        <button className="btn btn--primary" onClick={() => actions.view(b.id)}>Ver libro</button>
        <button className={'btn btn--icon ' + (liked ? 'is-on' : '')} onClick={() => actions.like(b.id)} aria-pressed={!!liked} aria-label="Favorito">{liked ? '♥' : '♡'}</button>
      </div>
    </article>
  );
}
