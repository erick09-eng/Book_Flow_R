import '../styles/cuenta.css';
import { useApp } from '../context/AppContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { users } from '../service/usersService';
import { loans } from '../service/loanService';
import { favorites } from '../service/favoriteService';
import AccountTabs from '../components/tabs/AccountTabs';

export default function Cuenta() {
  usePageTitle('BookFlow - Mi perfil');
  const { openModal, signedOut } = useApp();
  const u = users.current();
  if (!u) return null;

  const logout = () => { users.logout(); signedOut(); };

  return (
    <main className="wrap">
      <AccountTabs />
      <section className="panel panel--wide">
        <h1 className="panel__title">Hola, <span id="u-name">{u.name}</span></h1>
        <div className="stats">
          <div className="stats__item"><span className="stats__value" id="s-active">{`${loans.active(u.email).length} / ${loans.MAX_ACTIVE}`}</span><span className="stats__label">Préstamos activos</span></div>
          <div className="stats__item"><span className="stats__value" id="s-history">{loans.history(u.email).length}</span><span className="stats__label">Libros devueltos</span></div>
          <div className="stats__item"><span className="stats__value" id="s-likes">{favorites.ids(u.email).length}</span><span className="stats__label">Favoritos</span></div>
        </div>
        <dl>
          <div className="account__row"><dt>Correo</dt><dd id="u-email">{u.email}</dd></div>
          <div className="account__row"><dt>Miembro desde</dt><dd id="u-since">{new Date(u.since).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })}</dd></div>
        </dl>
        <div className="account__actions">
          <button className="btn btn--primary" onClick={() => openModal('edit')}>Modificar datos</button>
          <button className="btn btn--ghost" onClick={() => openModal('pass')}>Cambiar contraseña</button>
          <button className="btn btn--ghost" onClick={logout}>Cerrar sesión</button>
          <button className="btn btn--danger" onClick={() => openModal('delete')}>Eliminar cuenta</button>
        </div>
      </section>
    </main>
  );
}
