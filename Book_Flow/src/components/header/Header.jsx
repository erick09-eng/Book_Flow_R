import styles from './header.module.css';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </svg>
);

export default function Header() {
  const { user, openModal } = useApp();
  const { pathname } = useLocation();

  const isCatalogoActive = pathname === '/catalogo' || pathname.startsWith('/libro/');
  const isCuentaActive = pathname === '/cuenta' || pathname === '/biblioteca';

  const profileClick = (e) => { if (!user) { e.preventDefault(); openModal('auth'); } };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo} aria-current={pathname === '/' ? 'page' : undefined}>BookFlow</NavLink>
        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/catalogo"
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
            aria-current={isCatalogoActive ? 'page' : undefined}
          >
            Catálogo
          </NavLink>
          <NavLink
            to="/cuenta"
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
            onClick={profileClick}
            aria-current={isCuentaActive ? 'page' : undefined}
          >
            Mi perfil
          </NavLink>
        </nav>
        <NavLink
          to="/cuenta"
          onClick={profileClick}
          className={`${styles.user} ${user ? styles.userOn : ''}`}
          aria-label={user ? 'Mi perfil' : 'Iniciar sesión'}
        >
          <UserIcon />
        </NavLink>
      </div>
    </header>
  );
}
