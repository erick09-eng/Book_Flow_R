import { useApp } from '../../context/AppContext';
import { users } from '../../service/usersService';

export default function DeleteAccountModal() {
  const { user, signedOut } = useApp();

  const confirm = () => { users.remove(user.email); signedOut(); };

  return (
    <>
      <h2>Eliminar cuenta</h2>
      <p className="muted">Se borrarán tu cuenta, tus préstamos y tus favoritos. Esta acción no se puede deshacer.</p>
      <div className="card__actions">
        <button className="btn btn--danger" onClick={confirm}>Sí, eliminar</button>
        <button className="btn btn--ghost" data-close>Cancelar</button>
      </div>
    </>
  );
}
