# BookFlow (React + Vite)

> **🔗 URL de Producción**: https://book-flow-r.vercel.app/
> **📦 Repositorio 3er corte (React)**: https://github.com/erick09-eng/Book_Flow_R
> **📦 Repositorio 2do corte (Vanilla JS)**: https://github.com/erick09-eng/Book_Flow
> **📋 Bitácora completa**: [docs/bitacora.md](docs/bitacora.md)
> **🎯 Presentación interactiva (Netlify)**: https://cozy-gecko-c49e61.netlify.app/presentacion.html
> **🎯 Presentación interactiva (GitHub Pages)**: https://erick09-eng.github.io/Book_Flow_R/presentacion.html
> **📌 Commit entrega**: `9bded54` (branch `feature/erick`)

**Integrantes:**
- Erick Sebastián Bolívar Arboleda
- Andrés Felipe Galvis Tellez

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

## 🎯 Presentación interactiva (cómo verla)

### Opción 1: Link público (recomendado para el profe / celular)
- **Netlify**: https://cozy-gecko-c49e61.netlify.app/presentacion.html
- **GitHub Pages**: https://erick09-eng.github.io/Book_Flow_R/presentacion.html
- Se abre en cualquier celular/PC sin instalar nada, solo click en el link.

### Opción 2: Live Server (local, para desarrollo)
```bash
# Opción A: VS Code Live Server (extensión)
# 1. Instala extensión "Live Server" en VS Code
# 2. Click derecho en docs/presentacion.html → "Open with Live Server"
# 3. Se abre en http://127.0.0.1:5500/presentacion.html

# Opción B: npx serve (sin extensiones)
cd docs
npx serve -p 3000
# Abre http://localhost:3000/presentacion.html

# Opción C: Python (si lo tienes)
cd docs
python -m http.server 8000
# Abre http://localhost:8000/presentacion.html
```

### Controles de la presentación
| Acción | Teclado | Touch / Móvil |
|--------|---------|---------------|
| Slide siguiente | `↓` `Page Down` `Espacio` | Swipe izquierda |
| Slide anterior | `↑` `Page Up` | Swipe derecha |
| Primer slide | `Home` | Doble tap arriba |
| Último slide | `End` | Doble tap abajo |
| Ir a slide | Click en nav superior / dots laterales | Tap en nav / dots laterales |
| Pantalla completa | `F11` | Menú navegador → "Sitio de escritorio" |

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