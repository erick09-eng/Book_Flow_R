import './product-card.css';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useBookActions } from '../../hooks/useBookActions';
import { loans } from '../../service/loanService';
import { favorites } from '../../service/favoriteService';

export default function ProductCard({ book: b, note = '' }) {
  const { user } = useApp();
  const actions = useBookActions();
  const av = loans.availableCopies(b) > 0;
  const liked = user && favorites.isLiked(user.email, b.id);

  return (
    <article className="card">
      <Link to={`/libro/${b.id}`} className="card__link" aria-label={`Ver detalle de ${b.title}`}>
        <div className="card__cover" style={{ backgroundImage: b.cover }}>
          <span className={'badge ' + (av ? 'badge--ok' : 'badge--warn')}>{av ? 'Disponible' : 'En préstamo'}</span>
        </div>
        <h3 className="card__title">{b.title}</h3>
        <p className="muted">{b.author} · ★ {b.rating}</p>
      </Link>
      {note && <p className="muted">{note}</p>}
      <div className="card__actions">
        <Link to={`/libro/${b.id}`} className="btn btn--primary">Ver libro</Link>
        <button className={'btn btn--icon ' + (liked ? 'is-on' : '')} onClick={() => actions.like(b.id)} aria-pressed={!!liked} aria-label="Favorito">{liked ? '♥' : '♡'}</button>
      </div>
    </article>
  );
}
