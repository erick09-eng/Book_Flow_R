import './header.css';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </svg>
);

// Header compartido: se edita aquí y cambia en todas las vistas
export default function Header() {
  const { user, openModal } = useApp();
  const { pathname } = useLocation();

  const current = (paths) => (paths.includes(pathname) ? 'page' : undefined);
  // Icono / "Mi perfil": con sesión navega al perfil; sin sesión abre el login
  const profileClick = (e) => { if (!user) { e.preventDefault(); openModal('auth'); } };

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">BookFlow</Link>
        <nav className="header__nav">
          <Link to="/" aria-current={current(['/'])}>Inicio</Link>
          <Link to="/catalogo" aria-current={current(['/catalogo'])}>Catálogo</Link>
          <Link to="/cuenta" onClick={profileClick} aria-current={current(['/cuenta', '/biblioteca'])}>Mi perfil</Link>
        </nav>
        <Link to="/cuenta" onClick={profileClick} className={'header__user ' + (user ? 'is-on' : '')} aria-label={user ? 'Mi perfil' : 'Iniciar sesión'}>
          <UserIcon />
        </Link>
      </div>
    </header>
  );
}
