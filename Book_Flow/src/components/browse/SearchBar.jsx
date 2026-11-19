const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
  </svg>
);

// Barra superior: búsqueda + orden
export default function SearchBar({ q, onQ, sort, onSort }) {
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
    </div>
  );
}
