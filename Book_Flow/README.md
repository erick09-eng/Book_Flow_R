# BookFlow (React + Vite)

## Instalar y ejecutar
```
npm install
cp .env.example .env.local   # completa los valores (claves PÚBLICAS; .env.local no se sube a Git)
npm run dev                  # abrir http://localhost:5173
```
Requiere Node.js 22 o superior. Si cambias `.env.local`, reinicia Vite.

## Reseñas con API propia (clase 4)
- Tabla: `reviews` (script y políticas RLS en `supabase/reviews.sql`; ejecútalo en Supabase > SQL Editor).
- Columnas: `id` (uuid generado por la base), `user_id` (dueño, Supabase Auth), `book_id`, `author_name`, `rating` (1-5), `comment` (10-300 caracteres sin contar espacios sobrantes), `recommend`, `created_at`.
- Prerrequisitos de acceso: proveedor Google activo en Supabase Auth con el mismo Client ID de `service/config.js`, y para escribir hay que entrar con Google (la sesión de Supabase se abre con ese token). Leer no requiere sesión.
- Datos de práctica: ficticios; cada integrante puede borrar los suyos.
