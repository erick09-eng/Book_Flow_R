# BookFlow

Gestión inteligente de biblioteca personal para estudiantes y lectores. Permite organizar libros, hacer seguimiento de préstamos, guardar favoritos y compartir reseñas — todo en una interfaz limpia, rápida y responsive.

---

## Qué resuelve

Los estudiantes y lectores necesitan una forma simple de:

- Buscar y filtrar libros por género, autor, disponibilidad o calificación
- Pedir préstamos con control de fechas de devolución y renovaciones
- Guardar favoritos personales
- Escribir y leer reseñas con validación y persistencia real
- Tener todo sincronizado entre dispositivos

---

## Qué hace la aplicación

**Catálogo inteligente**
Búsqueda en tiempo real, filtros por género, rating y disponibilidad, ordenamiento múltiple, paginación y vista Grid/List que recuerda tu preferencia.

**Detalle de libro con URL propia**
Cada libro tiene su ruta `/libro/:id` con información completa, sinopsis, disponibilidad, acciones de préstamo/favorito y panel de reseñas. La URL se puede compartir y recargar sin perder el estado.

**Reseñas con persistencia real (CRUD)**
Crear, leer, editar y borrar reseñas con validación (rating 1-5, comentario 10-300 caracteres). Solo el dueño puede modificar las suyas. Lectura pública con filtros por texto y rating.

**Préstamos y favoritos**
Sistema de préstamos con límite de 3 activos, renovaciones (máx 2), historial de devoluciones y favoritos personales. Todo offline-first en localStorage.

**Acceso y sesión real**
Página de acceso completa (`/acceso`) con login, registro, recuperación de contraseña y Google OAuth. Rutas protegidas (`/cuenta`, `/biblioteca`, `/libro/:id`) que redirigen al login. Cierre de sesión limpia todo (préstamos, favoritos, sesión).

**Internacionalización nativa**
Fechas, números y ratings formateados según el idioma del navegador (`navigator.language`) usando `Intl.DateTimeFormat` y `Intl.NumberFormat`. Cero configuración, cero permisos.

---

## Tecnologías principales

| Capa | Tecnologías |
|------|-------------|
| Frontend | React 18, Vite 5, React Router 6 |
| UI | CSS Modules (Header), CSS custom properties, react-bootstrap (Alert) |
| Estado | React Context + Hooks personalizados |
| Datos locales | localStorage (préstamos, favoritos, preferencias, sesión) |
| Backend / Auth | Supabase (PostgreSQL + Auth + RLS) |
| OAuth | Google Identity Services |
| Testing | Node test runner nativo (`node --test`) |
| Calidad | ESLint 9, Prettier |
| Deploy | Vercel (Hobby) + Netlify (presentación) |

---

## Arquitectura

La aplicación sigue una arquitectura por capas:

```
Presentación (Pages, Components) 
    → Estado y Lógica (Context, Hooks: useBookActions, useCatalogView, useLocale, useReviews)
    → Servicios (bookService, loanService, favoriteService, reviewService, usersService, supabaseService)
    → Datos (localStorage, Supabase PostgreSQL + RLS, Google OAuth)
```

**Decisiones clave:**
- Supabase solo para reseñas (datos compartidos, requieren auth). Préstamos y favoritos en localStorage (offline-first, privados).
- Google OAuth → Supabase Auth → RLS en tabla `reviews`. Dos capas de seguridad: React Router protege la UI, RLS protege los datos.
- Hooks personalizados separan lógica de UI y son testeables (`useBookActions`, `useCatalogView`, `useLocale`, `useReviews`).
- CSS Modules solo en Header (cumple requisito). Resto usa variables CSS globales (`--color-*`, `--radius-*`, `--shadow-*`).

---

## Funcionalidades destacadas

- **7 rutas**: `/`, `/catalogo`, `/libro/:id`, `/acceso`, `/cuenta`, `/biblioteca`, 404
- **Navegación activa** con `NavLink` y subrayado animado; `/catalogo` sigue activo en `/libro/:id`
- **Vista Grid/List** persistente en localStorage con toggle animado
- **Detalle de libro** con loading, error + retry (3 intentos), "no disponible", enlace directo a fuente
- **Formularios controlados** con validación y mensajes útiles (login, registro, reseñas, recuperación)
- **Tests unitarios** (18 tests) sobre `validateReview` con `node --test`
- **Lint + Format** configurados (ESLint 9, Prettier)

---

## Enlaces

| Qué | Link |
|-----|------|
| Producción | https://book-flow-r.vercel.app/ |
| Repositorio (3er corte) | https://github.com/erick09-eng/Book_Flow_R |
| Repositorio (2do corte - Vanilla JS) | https://github.com/erick09-eng/Book_Flow |
| Bitácora técnica | https://github.com/erick09-eng/Book_Flow_R/blob/feature/erick/docs/bitacora.md |
| Presentación interactiva | https://cozy-gecko-c49e61.netlify.app/presentacion.html |

---

## Integrantes

- Erick Sebastián Bolívar Arboleda
- Andrés Felipe Galvis Tellez

---

## Cómo ejecutar localmente

**Requisitos:** Node.js 22+

```bash
# 1. Clonar e instalar
git clone https://github.com/erick09-eng/Book_Flow_R.git
cd Book_Flow_R/Book_Flow
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus claves de Google Cloud Console y Supabase

# 3. Ejecutar en desarrollo
npm run dev
# Abre http://localhost:5173
```

**Scripts disponibles:**
- `npm run dev` — Servidor de desarrollo (Vite)
- `npm run build` — Build de producción (`dist/`)
- `npm run preview` — Previsualiza el build local
- `npm run lint` — ESLint
- `npm run format` — Prettier
- `npm test` — Tests unitarios (`node --test`)

---

## Cómo ver la presentación interactiva

**Opción 1: Link público (recomendado)**
- Netlify: https://cozy-gecko-c49e61.netlify.app/presentacion.html
- Se abre en cualquier celular/PC sin instalar nada.

**Opción 2: Local (Live Server)**
```bash
# VS Code: Click derecho en docs/presentacion.html → "Open with Live Server"
# O terminal:
cd docs
npx serve -p 3000
# Abre http://localhost:3000/presentacion.html
```

**Controles:**
- Navegación: Flechas ↑↓, Espacio, Page Up/Down, Home, End
- Nav superior: Click en "Problema", "Migración", "Arquitectura", etc.
- Dots laterales (derecha): Click para saltar directo
- Touch/Swipe: Funciona en tablet/móvil
- Pantalla completa: F11

---

## Despliegue en producción

La aplicación está desplegada en **Vercel Hobby** con build automático desde GitHub. Las variables de entorno (`VITE_GOOGLE_CLIENT_ID`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_TABLA_RESENAS`) se configuran en Vercel → Settings → Environment Variables.

Supabase Auth configurado con Google OAuth y RLS en tabla `reviews`. Redirect URL autorizada: `https://book-flow-r.vercel.app/acceso`.

---

## Licencia

Proyecto académico — Desarrollo Web EAM 2026-II — Tercer Corte