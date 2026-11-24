import { useApp } from '../../context/AppContext';
import { useBookActions, fmt } from '../../hooks/useBookActions';
import { books } from '../../service/bookService';
import { loans } from '../../service/loanService';
import { favorites } from '../../service/favoriteService';
import ReviewsPanel from '../reviews/ReviewsPanel';

// Resuelve hrefs relativos de libros-programacion-gratis a la URL completa de librosgratis.dev
const resolveHref = (href) => {
  if (!href) return '';
  return /^https?:\/\//i.test(href) ? href : `https://librosgratis.dev${href}`;
};

const Spec = ({ k, v }) => <div className="spec"><dt>{k}</dt><dd>{v ?? '—'}</dd></div>;

// Ventana emergente con todos los detalles del libro
export default function BookModal({ id }) {
  const { user } = useApp();
  const actions = useBookActions();
  const b = books.get(id);
  if (!b) return null;

  const left = loans.availableCopies(b);
  const liked = user && favorites.isLiked(user.email, b.id);
  const loan = user && loans.active(user.email).find((l) => l.bookId === b.id);

  return (
    <div className="detail">
      <div className="detail__cover" style={{ backgroundImage: b.cover }}></div>
      <div className="detail__info">
        <div className="tags">{b.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
        <h2>{b.title}</h2>
        <p className="muted">Por {b.author}</p>
        <p>
          ★ {b.rating} <span className="muted">({b.reviews} reseñas)</span> ·{' '}
          <span className={left > 0 ? 'ok' : 'warn'}>{left > 0 ? `Disponible · ${left} de ${b.copies} copias` : 'En préstamo'}</span>
        </p>
        {b.href && (
          <p className="muted">
            <a href={resolveHref(b.href)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent-orange)', textDecoration: 'underline', fontSize: '0.92rem' }}>📖 Leer en línea →</a>
          </p>
        )}
        <h3>Sinopsis</h3>
        <p className="muted">{b.synopsis}</p>
        <dl className="specs">
          <Spec k="Género" v={b.genre} />
          <Spec k="Tema" v={b.topic} />
          <Spec k="Páginas" v={b.pages} />
          <Spec k="Año de publicación" v={b.year} />
          <Spec k="Editorial" v={b.publisher} />
          <Spec k="ISBN" v={b.isbn} />
          {loan && <Spec k="Fecha de préstamo" v={fmt(loan.loanDate)} />}
          {loan && <Spec k="Fecha de devolución" v={fmt(loan.dueDate)} />}
        </dl>
        <div className="card__actions">
          {loan ? (
            <>
              <button className="btn btn--primary" onClick={() => actions.renew(loan.id)}>Renovar</button>
              <button className="btn btn--ghost" onClick={() => actions.giveBack(loan.id)}>Devolver</button>
            </>
          ) : (
            <button className="btn btn--primary" onClick={() => actions.loan(b.id)} disabled={left <= 0}>{left > 0 ? 'Pedir préstamo' : 'No disponible'}</button>
          )}
          <button className="btn btn--ghost" onClick={() => actions.like(b.id)}>{liked ? '♥ En favoritos' : '♡ Añadir a favoritos'}</button>
        </div>
        <ReviewsPanel book={b} />
      </div>
    </div>
  );
}
