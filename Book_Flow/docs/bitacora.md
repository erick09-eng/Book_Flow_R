# Bitácora Principal - BookFlow (3er Corte)

## 📦 Identificación
- **Proyecto**: BookFlow - Gestión de biblioteca personal
- **Integrantes**: 
  - Erick Sebastián Bolívar Arboleda
  - Andrés Felipe Galvis Tellez
- **Repositorio 3er corte (React)**: https://github.com/erick09-eng/Book_Flow_R
- **Repositorio 2do corte (Vanilla JS)**: https://github.com/erick09-eng/Book_Flow
- **URL Producción**: https://book-flow-r.vercel.app/
- **Commit entrega**: `4252bbf` (main branch)

---

## 🔄 Qué se migró (Vanilla JS → React + Vite)

| Antes (presentation/) | Después (src/) | Comentario |
|----------------------|----------------|------------|
| `index.html` + `app.js` | `main.jsx` + `App.jsx` + `pages/*.jsx` | Entry point + routing |
| HTML estático por vista | Componentes React reutilizables | Header, Footer, ProductCard, Modal, Toast, Tabs |
| `app.js` (monolito 800+ líneas) | Context + Hooks + Services | Separación de responsabilidades |
| `localStorage` directo | `storage.js` + hooks (`useCatalogView`) | Abstracción con try/catch |
| Modal único con `data-*` | `ModalRoot` + componentes por tipo | AuthModal, BookModal, etc. |
| Reseñas en Supabase (CDN) | `@supabase/supabase-js` npm + RLS | Mismo schema, cliente moderno |

---

## 👥 Aportes por integrante

| Integrante | Qué hizo |
|------------|----------|
| **Erick Sebastián Bolívar Arboleda** | Migración routing, páginas Detalle/Acceso/404, NavLink activo, CSS Modules, react-bootstrap Alert, localStorage vista, limpieza sesión, test unitario, i18n (useLocale) |
| **Andrés Felipe Galvis Tellez** | Deploy config (vercel.json, .env.example), README, bitácora, Supabase RLS, Google Auth, componentes reutilizables |

---

## 🎯 Decisiones técnicas clave

1. **Context + useState**: Se usó `useState` en `AppContext` por simplicidad (sesión, modal, toast). No hay estado global complejo.
2. **Hooks personalizados**: `useBookActions`, `useCatalogView`, `useLocale`, `useReviews` — separan lógica de UI y son testeables.
3. **Supabase solo para reseñas**: Préstamos y favoritos en `localStorage` (datos no sensibles, offline-first). Reseñas en Supabase con RLS (datos compartidos, requieren auth).
4. **Google OAuth → Supabase Auth**: Token de Google se pasa a `supabaseClient.auth.signInWithIdToken()` para que RLS funcione en reseñas.
5. **CSS Module solo en Header**: Cumple requisito; resto usa CSS global con variables CSS (`--color-*`).
6. **react-bootstrap solo Alert**: Librería visual mínima; resto UI propia.
7. **i18n (Intl) vs Geolocalización**: Se eligió **Intl** (`useLocale`) por: cero permisos, encaja en fechas de préstamo/reseñas, valor real inmediato.

---

## 🐛 Problemas resueltos

| Problema | Solución |
|----------|----------|
| Modal libro sin URL propia → no se puede compartir/recargar | Nueva ruta `/libro/:id` + página `Detalle.jsx` con loading/error/retry |
| `ProtectedRoute` redirigía a `/?login=1` (modal) | Ahora redirige a `/acceso` (página pública completa) |
| Cerrar sesión no limpiaba datos de usuario anterior | `signedOut()` llama `loans.removeAllForUser()` + `favorites.removeAllForUser()` |
| `validateReview` fallaba con `comment: undefined` | Nullish coalescing: `(comment ?? '').trim()` |
| ESLint: `setState` en effect / refs en render | `useCallback` + `eslint-disable` comentado + `useEffect` para actualizar ref |
| Credenciales hardcodeadas en `config.js` | Movidas a `.env.local` + `import.meta.env` + `.ejemplo` |

---

## ⏳ Pendientes / Mejora futura

- [ ] Tests E2E (Cypress/Playwright) para flujos críticos
- [ ] Code-splitting (`React.lazy`) para reducir bundle >500KB
- [ ] EmailJS configurado para recuperación de contraseña real
- [ ] PWA (service worker + manifest) para uso offline
- [ ] Storybook para documentar componentes reutilizables

---

## ✅ Checklist entrega (guía 3er corte)

| Requisito | Estado |
|-----------|--------|
| React + Vite + JSX | ✅ |
| Componentes reutilizables + props | ✅ (Header, ProductCard, ModalRoot, Toast, Tabs, Forms) |
| Estado React + formulario controlado + validaciones | ✅ (Acceso, ReviewForm) |
| Hook propio con lógica separada | ✅ (`useBookActions`, `useCatalogView`, `useLocale`, `useReviews`) |
| Efecto para sincronizar externo | ✅ (`useReviews` → AbortController + API) |
| CRUD entidad principal (reseñas) en Supabase | ✅ Create/Read/Update/Delete + RLS |
| Búsqueda/filtro en API + loading/error/retry/empty | ✅ (`useReviews` + `ReviewFilter`) |
| Detalle por ID real + recarga persiste | ✅ `/libro/:id` |
| Entrada pública (`/`) + página acceso (`/acceso`) | ✅ |
| Rutas privadas listado (`/biblioteca`) + detalle (`/libro/:id`) | ✅ |
| Menú con sección activa (NavLink + subrayado) | ✅ |
| Vista 404 | ✅ (`NotFound.jsx`) |
| Context para sesión compartida | ✅ (`AppContext`) |
| React Router (pantalla) + RLS Supabase (datos) | ✅ |
| CSS Modules | ✅ (`header.module.css`) |
| Librería visual (react-bootstrap Alert) | ✅ (`Detalle.jsx`) |
| Preferencia localStorage (vista catálogo) | ✅ (`useCatalogView`) |
| Localización (Intl/i18n) | ✅ (`useLocale`) |
| Test unitario regla real (`validateReview`) | ✅ (18 tests passing) |
| `vercel.json` con rewrite SPA | ✅ |
| Variables `VITE_` en Vercel | ✅ (documentado) |
| Supabase Redirect URL autorizada | ✅ (documentado) |
| `docs/bitacora.md` | ✅ (este archivo) |
| README con identificación, ejecución, recorrido | ✅ |
| `.env.example` sin valores reales | ✅ |
| `.gitignore` excluye `node_modules`, `dist`, `.env.local` | ✅ |
| Repo privado + acceso al profe | ✅ (acceso concedido) |

---

## 📅 Historial de commits relevantes

```
git log --oneline -20
```

*(Ejecutar: `git log --oneline -20 > docs/commits.txt`)*

---

*Última actualización: 2026-11-26*