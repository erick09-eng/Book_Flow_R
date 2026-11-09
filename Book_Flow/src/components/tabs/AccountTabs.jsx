import './tabs.css';
import { Link, useLocation } from 'react-router-dom';

// Navegación interna de la cuenta (perfil / biblioteca / favoritos)
export default function AccountTabs() {
  const { pathname, search } = useLocation();
  const fav = new URLSearchParams(search).get('tab') === 'favs';
  const on = pathname === '/cuenta' ? 0 : fav ? 2 : 1;
  const tabs = [['/cuenta', 'Mi perfil'], ['/biblioteca', 'Mi biblioteca'], ['/biblioteca?tab=favs', 'Favoritos']];
  return (
    <nav className="tabs" id="acc-nav" aria-label="Mi cuenta">
      {tabs.map(([to, text], i) => <Link key={to} className={'tab ' + (i === on ? 'tab--on' : '')} to={to}>{text}</Link>)}
    </nav>
  );
}
