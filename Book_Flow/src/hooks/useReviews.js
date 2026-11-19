import { useEffect, useState } from 'react';
import { listReviews } from '../service/reviewApi';

// Lee las reseñas de un libro desde la API. Declara todo lo que lee: bookId, rating y revision.
// - vigente: impide que una lectura retirada aplique sus datos o apague la carga de la nueva.
// - AbortController: cancela la petición de red anterior (aparece como "cancelled" en Network).
// - revision: se incrementa con recargar() para consultar de nuevo sin cambiar los criterios.
export function useReviews(bookId, rating) {
  const [revision, setRevision] = useState(0);
  const [consulta, setConsulta] = useState({ filas: [], cargando: true, error: '' });

  useEffect(() => {
    let vigente = true;
    const control = new AbortController();
    setConsulta({ filas: [], cargando: true, error: '' });
    async function cargar() {
      try {
        const filas = await listReviews(bookId, rating, control.signal);
        if (vigente) setConsulta({ filas, cargando: true, error: '' });
      } catch (error) {
        // Una lectura cancelada por la limpieza no es un error de la búsqueda actual
        if (vigente && !control.signal.aborted) setConsulta({ filas: [], cargando: true, error: error.message });
      } finally {
        if (vigente) setConsulta((actual) => ({ ...actual, cargando: false }));
      }
    }
    cargar();
    return () => { vigente = false; control.abort(); };
  }, [bookId, rating, revision]);

  return { ...consulta, recargar: () => setRevision((n) => n + 1) };
}
