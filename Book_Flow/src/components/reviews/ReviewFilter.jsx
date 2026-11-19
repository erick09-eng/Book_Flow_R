import { useId, useRef } from 'react';

// El texto se controla y avisa al padre mientras se escribe (onChangeText).
// La calificación se confirma al enviar y se lee con FormData (onFilter), como pide la guía.
export default function ReviewFilter({ text, onChangeText, onFilter, onClear }) {
  const id = useId();
  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const datos = new FormData(event.currentTarget); // lee por name, no por id
    onFilter({ rating: String(datos.get('rating') ?? '') });
  };

  const handleClear = () => {
    formRef.current.reset(); // vuelve el selector no controlado a su valor inicial
    onClear();
  };

  return (
    <form className="review-filter" onSubmit={handleSubmit} ref={formRef}>
      <div className="field">
        <label htmlFor={id + '-text'}>Buscar en las reseñas</label>
        <input id={id + '-text'} name="search" type="search" value={text} onChange={(e) => onChangeText(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor={id + '-rating'}>Calificación</label>
        <select id={id + '-rating'} name="rating" defaultValue="">
          <option value="">Todas</option>
          <option value="5">5 estrellas</option>
          <option value="4">4 estrellas</option>
          <option value="3">3 estrellas</option>
          <option value="2">2 estrellas</option>
          <option value="1">1 estrella</option>
        </select>
      </div>
      <div className="review-filter__actions">
        <button className="btn btn--primary" type="submit">Aplicar filtros</button>
        <button className="btn btn--ghost" type="button" onClick={handleClear}>Limpiar</button>
      </div>
    </form>
  );
}
