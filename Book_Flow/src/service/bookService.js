/* Catálogo de libros.
   Los datos vienen de la API de libros-programacion-gratis (midudev),
   embalados en ./libros-api.json (se genera a partir de
   https://github.com/midudev/libros-programacion-gratis).
   En React el JSON se importa directamente, por eso ya no hace falta cargarlo con fetch. */
import data from './libros-api.json';

const cache = Array.isArray(data) ? data : [];

export const books = {
  all: () => cache,

  get: (id) => cache.find((b) => b.id === Number(id)) || null,

  async searchExternal(query) {
    if (!query) return [];
    const q = String(query).toLowerCase();
    return cache.filter((b) =>
      [b.title, b.author, b.topic, b.genre, ...(b.tags || [])].join(' ').toLowerCase().includes(q)
    );
  },
};
