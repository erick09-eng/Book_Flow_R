export default function Pagination({ current, pages, onPage }) {
  if (pages < 2) return <nav className="pagination" id="pager" aria-label="Paginación"></nav>;
  return (
    <nav className="pagination" id="pager" aria-label="Paginación">
      <button className="btn btn--icon" onClick={() => onPage(current - 1)} disabled={current === 1} aria-label="Anterior">‹</button>
      {Array.from({ length: pages }, (_, i) => (
        <button key={i} className={'btn btn--icon ' + (i + 1 === current ? 'is-on' : '')} onClick={() => onPage(i + 1)}>{i + 1}</button>
      ))}
      <button className="btn btn--icon" onClick={() => onPage(current + 1)} disabled={current === pages} aria-label="Siguiente">›</button>
    </nav>
  );
}
