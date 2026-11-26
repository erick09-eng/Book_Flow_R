const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
  </svg>
);

const GridIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ListIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="5" x2="21" y2="5" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="19" x2="21" y2="19" />
  </svg>
);

// Barra superior: búsqueda + orden + vista
export default function SearchBar({ q, onQ, sort, onSort, view, onViewToggle }) {
  return (
    <div className="toolbar">
      <div className="search">
        <SearchIcon />
        <input type="search" id="q" placeholder="Buscar por título, autor o tema..." value={q} onChange={(e) => onQ(e.target.value)} />
      </div>
      <select id="sort" aria-label="Ordenar" value={sort} onChange={(e) => onSort(e.target.value)}>
        <option value="new">Más recientes</option>
        <option value="rating">Mejor calificados</option>
        <option value="title">Título A-Z</option>
      </select>
      <button
        type="button"
        className="view-toggle"
        onClick={onViewToggle}
        aria-label={view === 'grid' ? 'Cambiar a vista de lista' : 'Cambiar a vista de cuadrícula'}
        aria-pressed={view === 'list'}
      >
        {view === 'grid' ? <ListIcon /> : <GridIcon />}
      </button>
    </div>
  );
}
