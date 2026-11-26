# BookFlow (React + Vite)

> **🔗 URL de Producción**: https://book-flow-r.vercel.app/
> **📦 Repositorio 3er corte (React)**: https://github.com/erick09-eng/book-flow-react
> **📦 Repositorio 2do corte (Vanilla JS)**: https://github.com/erick09-eng/Book_Flow
> **📋 Bitácora completa**: [docs/bitacora.md](docs/bitacora.md)
> **📌 Commit entrega**: `main` (último commit)

## Instalar y ejecutar
```
npm install
cp .env.example .env.local   # completa los valores (claves PÚBLICAS; .env.local no se sube a Git)
npm run dev                  # abrir http://localhost:5173
```
Requiere Node.js 22 o superior. Si cambias `.env.local`, reinicia Vite.

## Scripts disponibles
```
npm run dev        # Servidor de desarrollo (Vite)
npm run build      # Build de producción (genera /dist)
npm run preview    # Previsualiza el build local
npm run lint       # ESLint (revisa código)
npm run format     # Prettier (formatea código)
npm test           # Tests unitarios (node --test)
```

## Variables de entorno (.env.local)
| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `VITE_GOOGLE_CLIENT_ID` | OAuth Client ID tipo "Aplicación web" (Google Cloud Console) | Sí |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase | Sí |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clave anónima (anon) de Supabase | Sí |
| `VITE_TABLA_RESENAS` | Nombre de la tabla de reseñas (default: `reviews`) | No |
| `VITE_EMAILJS_SERVICE_ID` | Service ID de EmailJS (recuperar contraseña) | No |
| `VITE_EMAILJS_TEMPLATE_ID` | Template ID de EmailJS | No |
| `VITE_EMAILJS_PUBLIC_KEY` | Public Key de EmailJS | No |

## Reseñas con API propia (clase 4)
- Tabla: `reviews` (script y políticas RLS en `supabase/reviews.sql`; ejecútalo en Supabase > SQL Editor).
- Columnas: `id` (uuid generado por la base), `user_id` (dueño, Supabase Auth), `book_id`, `author_name`, `rating` (1-5), `comment` (10-300 caracteres sin contar espacios sobrantes), `recommend`, `created_at`.
- Prerrequisitos de acceso: proveedor Google activo en Supabase Auth con el mismo Client ID de `VITE_GOOGLE_CLIENT_ID`, y para escribir hay que entrar con Google (la sesión de Supabase se abre con ese token). Leer no requiere sesión.
- Datos de práctica: ficticios; cada integrante puede borrar los suyos.

## Despliegue en Vercel
1. Conecta el repo en Vercel (Framework: Vite).
2. En **Settings → Environment Variables**, añade las variables de `.env.example` (prefijo `VITE_`).
3. En **Supabase → Authentication → URL Configuration**, añade la URL de Vercel (`https://book-flow-r.vercel.app`) a **Site URL** y a **Redirect URLs** (`https://book-flow-r.vercel.app/acceso`).
4. Deploy automático en cada push a `main`.

## Bitácora - Clase 5
| Fecha | Actividad | Responsable | Observaciones |
|-------|-----------|-------------|---------------|
|       | Migración a React + Vite | | |
|       | Rutas `/libro/:id`, `/acceso`, 404 | | |
|       | NavLink + estado activo (subrayado) | | |
|       | CSS Module en Header | | |
|       | react-bootstrap Alert en Detalle | | |
|       | Preferencia localStorage (vista catálogo) | | |
|       | Limpieza completa al cerrar sesión | | |
|       | Test unitario `validateReview` | | |
|       | Localización (geolocalización / i18n) | | Confirmar con profesor |
|       | Despliegue Vercel + variables + Supabase redirect | | |
|       | Limpieza: .env, ESLint/Prettier, borrar `presentation/` | | |