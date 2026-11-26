import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { books } from '../service/bookService';
import { useApp } from '../context/AppContext';
import { useLocale } from '../hooks/useLocale';
import ReviewsPanel from '../components/reviews/ReviewsPanel';
import { loans } from '../service/loanService';
import { favorites } from '../service/favoriteService';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import '../styles/detalle.css';

const resolveHref = (href) => {
  if (!href) return '';
  return /^https?:\/\//i.test(href) ? href : `https://librosgratis.dev${href}`;
};

const Spec = ({ k, v }) => (
  <div className="spec">
    <dt>{k}</dt>
    <dd>{v ?? '—'}</dd>
  </div>
);

export default function Detalle() {
  const { id } = useParams();
  const { user, toast, openModal } = useApp();
  const { formatDate } = useLocale();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  usePageTitle('BookFlow - Detalle del libro');

  const fetchBook = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      const b = books.get(id);
      if (!b) {
        setError('NO_DISPONIBLE');
      } else {
        setBook(b);
      }
    } catch {
      setError('CARGA_FALLIDA');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount/id change
    fetchBook();
  }, [fetchBook]);

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount((c) => c + 1);
      fetchBook();
    } else {
      setError('MAX_REINTENTOS');
    }
  };

  if (loading) {
    return (
      <main className="detalle">
        <div className="detalle__loading">Cargando libro…</div>
      </main>
    );
  }

  if (error) {
    const messages = {
      NO_DISPONIBLE: 'El libro no está disponible o no existe.',
      CARGA_FALLIDA: 'Error al cargar el libro. Intenta de nuevo.',
      MAX_REINTENTOS: 'Demasiados intentos fallidos. Vuelve al catálogo.',
    };
    return (
      <main className="detalle">
        <div className="detalle__error">
          <Alert variant="danger" className="detalle__alert">
            <h2>No se pudo cargar el libro</h2>
            <p>{messages[error]}</p>
            {error !== 'MAX_REINTENTOS' && (
              <Button variant="outline-primary" onClick={handleRetry} className="mt-2">
                Reintentar ({retryCount}/3)
              </Button>
            )}
            <Link to="/catalogo" className="detalle__volver">
              <Button variant="secondary" className="mt-2">Volver al catálogo</Button>
            </Link>
          </Alert>
        </div>
      </main>
    );
  }

  if (!book) {
    return null;
  }

  const left = loans.availableCopies(book);
  const liked = user && favorites.isLiked(user.email, book.id);
  const loan = user && loans.active(user.email).find((l) => l.bookId === book.id);

  const runAction = (kind, bookId) => {
    if (!user) {
      toast('Inicia sesión para continuar.', false);
      return openModal('auth');
    }
    let r;
    if (kind === 'like') {
      r = favorites.toggle(user.email, bookId);
      r.ok && toast(r.data.liked ? 'Añadido a favoritos.' : 'Quitado de favoritos.');
    } else if (kind === 'loan') {
      r = loans.request(user.email, bookId);
      r.ok && toast('Préstamo creado. Devuélvelo antes del ' + formatDate(r.data.dueDate));
    } else if (kind === 'renew') {
      r = loans.renew(bookId);
      r.ok && toast('Renovado hasta el ' + formatDate(r.data.dueDate));
    } else {
      r = loans.returnBook(bookId);
      r.ok && toast('Libro devuelto.');
    }
    if (!r.ok) toast(r.error, false);
  };

  return (
    <main className="detalle">
      <article className="detalle__card">
        <div className="detalle__cover" style={{ backgroundImage: book.cover }}></div>
        <div className="detalle__info">
          <div className="detalle__tags">
            {book.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
          <h1>{book.title}</h1>
          <p className="detalle__author">Por {book.author}</p>
          <p className="detalle__meta">
            <span>★ {book.rating} <span className="muted">({book.reviews} reseñas)</span></span>
            <span className={left > 0 ? 'ok' : 'warn'}>
              {left > 0 ? `Disponible · ${left} de ${book.copies} copias` : 'En préstamo'}
            </span>
          </p>
          {book.href && (
            <p className="detalle__read-online">
              <a
                href={resolveHref(book.href)}
                target="_blank"
                rel="noopener noreferrer"
              >
                📖 Leer en línea →
              </a>
            </p>
          )}
          <h2>Sinopsis</h2>
          <p className="detalle__synopsis">{book.synopsis}</p>
          <dl className="detalle__specs">
            <Spec k="Género" v={book.genre} />
            <Spec k="Tema" v={book.topic} />
            <Spec k="Páginas" v={book.pages} />
            <Spec k="Año de publicación" v={book.year} />
            <Spec k="Editorial" v={book.publisher} />
            <Spec k="ISBN" v={book.isbn} />
            {loan && <Spec k="Fecha de préstamo" v={formatDate(loan.loanDate)} />}
            {loan && <Spec k="Fecha de devolución" v={formatDate(loan.dueDate)} />}
          </dl>
          <div className="detalle__actions">
            {loan ? (
              <>
                <Button variant="primary" onClick={() => runAction('renew', loan.id)}>
                  Renovar
                </Button>
                <Button variant="outline-secondary" onClick={() => runAction('return', loan.id)}>
                  Devolver
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={() => runAction('loan', book.id)}
                disabled={left <= 0}
              >
                {left > 0 ? 'Pedir préstamo' : 'No disponible'}
              </Button>
            )}
            <Button
              variant="outline-secondary"
              onClick={() => runAction('like', book.id)}
              className={liked ? 'is-on' : ''}
            >
              {liked ? '♥ En favoritos' : '♡ Añadir a favoritos'}
            </Button>
          </div>
          <ReviewsPanel book={book} />
        </div>
      </article>
    </main>
  );
}