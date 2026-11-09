// Barra lateral de filtros: género, disponibilidad y calificación mínima
export default function Filters({ genres, selected, onGenre, disp, prest, onDisp, onPrest, rating, onRating, onClear }) {
  return (
    <aside className="filters">
      <h2>Filtros</h2>
      <div>
        <h3>Género</h3>
        {genres.map((g) => (
          <label className="check" key={g}><input type="checkbox" checked={selected.includes(g)} onChange={() => onGenre(g)} /> {g}</label>
        ))}
      </div>
      <div>
        <h3>Disponibilidad</h3>
        <label className="check"><input type="checkbox" id="f-disp" checked={disp} onChange={(e) => onDisp(e.target.checked)} /> Disponible</label>
        <label className="check"><input type="checkbox" id="f-prest" checked={prest} onChange={(e) => onPrest(e.target.checked)} /> En préstamo</label>
      </div>
      <div>
        <h3>Calificación mínima: <span id="rating-out">{rating.toFixed(1)}</span></h3>
        <input type="range" id="f-rating" min="1" max="5" step="0.5" value={rating} onChange={(e) => onRating(Number(e.target.value))} />
      </div>
      <button className="btn btn--ghost" type="button" id="f-clear" onClick={onClear}>Limpiar filtros</button>
    </aside>
  );
}
