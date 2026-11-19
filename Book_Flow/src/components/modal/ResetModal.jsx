import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { users } from '../../service/usersService';
import { sendCode } from '../../service/emailService';
import FormMessage from '../forms/FormMessage';

export default function ResetModal({ email }) {
  const { user, toast, openModal, closeModal } = useApp();
  const [msg, setMsg] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    const r = await users.resetPassword(email, d.code, d.new, d.confirm);
    if (!r.ok) return setMsg({ text: r.error, ok: false });
    toast('Contraseña actualizada.');
    user ? closeModal() : openModal('auth');
  };

  const resend = async () => {
    const r = await sendCode(email);
    toast(r.ok ? 'Te enviamos un código nuevo.' : r.error, r.ok);
  };

  return (
    <>
      <h2>Ingresa el código</h2>
      <p className="muted">Si <strong>{email}</strong> tiene una cuenta, recibirás un código de 6 dígitos que vence en 15 minutos. Revisa también el spam.</p>
      <form className="form" noValidate onSubmit={onSubmit}>
        <label className="field">Código<input name="code" inputMode="numeric" maxLength={6} autoComplete="one-time-code" required /></label>
        <label className="field">Nueva contraseña<input type="password" name="new" autoComplete="new-password" required /></label>
        <label className="field">Confirmar nueva contraseña<input type="password" name="confirm" autoComplete="new-password" required /></label>
        <FormMessage msg={msg} />
        <button className="btn btn--primary" type="submit">Cambiar contraseña</button>
      </form>
      <button type="button" className="link" onClick={resend}>Reenviar código</button>
    </>
  );
}
