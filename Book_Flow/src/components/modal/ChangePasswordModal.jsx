import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { users } from '../../service/usersService';
import FormMessage from '../forms/FormMessage';

export default function ChangePasswordModal() {
  const { user, toast, openModal, closeModal } = useApp();
  const [msg, setMsg] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    const r = await users.changePassword(user.email, d.old, d.new, d.confirm);
    if (r.ok) { closeModal(); toast('Contraseña actualizada.'); }
    else setMsg({ text: r.error, ok: false });
  };

  return (
    <>
      <h2>Cambiar contraseña</h2>
      <form className="form" onSubmit={onSubmit}>
        <label className="field">Contraseña actual<input type="password" name="old" autoComplete="current-password" required /></label>
        <label className="field">Nueva contraseña<input type="password" name="new" autoComplete="new-password" required /></label>
        <label className="field">Confirmar nueva contraseña<input type="password" name="confirm" autoComplete="new-password" required /></label>
        <FormMessage msg={msg} />
        <button className="btn btn--primary">Actualizar contraseña</button>
      </form>
      <button type="button" className="link" onClick={() => openModal('forgot', { prefill: user.email })}>¿Olvidaste tu contraseña?</button>
    </>
  );
}
