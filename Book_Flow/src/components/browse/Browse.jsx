import './browse.css';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { books } from '../../service/bookService';
import { loans } from '../../service/loanService';
import { favorites } from '../../service/favoriteService';
import { fmt } from '../../hooks/useBookActions';
import ProductCard from '../product-card/ProductCard';
import Filters from './Filters';
import SearchBar from './SearchBar';
import Pagination from './Pagination';

const SIZE = 8;

// Catálogo y biblioteca comparten buscador, filtros, orden y paginación
export default function Browse({ isLib = false, tab = 'loans' }) {
  const { user } = useApp();
  const [params] = useSearchParams();
  const allBooks = books.all() || [];
  const genres = useMemo(() => [...new Set(allBooks.map((b) => b && b.genre).filter((g) => g && g.length > 0))], [allBooks]);

  const [q, setQ] = useState(params.get('q') || '');
  const [sort, setSort] = useState('new');
  const [gs, setGs] = useState([]);
  const [dispOn, setDispOn] = useState(false);
  const [prestOn, setPrestOn] = useState(false);
  const [min, setMin] = useState(1);
  const [page, setPage] = useState(1);

  // Cualquier cambio en buscador o filtros vuelve a la página 1
  const reset = (setter) => (v) => { setter(v); setPage(1); };
  const toggleGenre = (g) => { setGs((cur) => (cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g])); setPage(1); };
  const clear = () => { setGs([]); setDispOn(false); setPrestOn(false); setMin(1); setQ(''); setSort('new'); setPage(1); };

  // Libros de origen: todo el catálogo, los préstamos activos o los favoritos
  const local = !isLib ? books.all().map((b) => ({ b }))
    : tab === 'favs' ? favorites.list(user.email).map((b) => ({ b }))
    : loans.active(user.email).map((l) => ({ b: books.get(l.bookId), note: 'Vence el' + fmt(l.dueDate) }));

  const query = q.trim().toLowerCase();
  const list = local.filter(({ b }) => {
    const av = loans.availableCopies(b) > 0;
    const text = [b.title, b.author, b.topic, b.genre, ...b.tags].join(' ').toLowerCase();
    return (!gs.length || gs.includes(b.genre)) && b.rating >= min && text.includes(query) && (dispOn === prestOn || (av ? dispOn : prestOn));
  }).sort((x, y) => sort === 'rating' ? y.b.rating - x.b.rating : sort === 'title' ? x.b.title.localeCompare(y.b.title) : y.b.id - x.b.id);

  const pages = Math.max(1, Math.ceil(list.length / SIZE));
  const current = Math.min(page, pages);
  const emptyText = isLib && !local.length
    ? (tab === 'favs' ? 'Aún no tienes favoritos. Toca ♡ en cualquier libro.' : 'No tienes préstamos activos. Pide un libro desde el catálogo.')
    : local.length === 0
      ? 'No hay libros en el catálogo. Usa el buscador para encontrar alguno.'
      : 'Ningún libro coincide con la búsqueda o los filtros.';
  const visible = list.slice((current - 1) * SIZE, current * SIZE);

  return (
    <div className="browse">
      <Filters
        genres={genres} selected={gs} onGenre={toggleGenre}
        disp={dispOn} onDisp={reset(setDispOn)} prest={prestOn} onPrest={reset(setPrestOn)}
        rating={min} onRating={reset(setMin)} onClear={clear}
      />
      <section>
        <SearchBar q={q} onQ={reset(setQ)} sort={sort} onSort={reset(setSort)} />
        <p className="muted" id="count">{list.length} {list.length === 1 ? 'libro' : 'libros'}</p>
        <div className="grid" id="grid">
          {visible.length
            ? visible.map(({ b, note }) => <ProductCard key={b.id} book={b} note={note} />)
            : <p className="muted empty">{emptyText}</p>}
        </div>
        <Pagination current={current} pages={pages} onPage={setPage} />
      </section>
    </div>
  );
}
