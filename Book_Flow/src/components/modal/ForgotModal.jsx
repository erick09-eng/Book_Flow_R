import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { sendCode } from '../../service/emailService';
import FormMessage from '../forms/FormMessage';

export default function ForgotModal({ prefill = '' }) {
  const { openModal } = useApp();
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const email = e.currentTarget.elements.email.value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setMsg({ text: 'Escribe un correo válido.', ok: false });
    setBusy(true); setMsg({ text: 'Enviando código...', ok: true });
    const r = await sendCode(email);
    if (!r.ok) { setBusy(false); return setMsg({ text: r.error, ok: false }); }
    openModal('reset', { email });
  };

  return (
    <>
      <h2>Recuperar contraseña</h2>
      <p className="muted">Escribe tu correo y te enviaremos un código de 6 dígitos.</p>
      <form className="form" noValidate onSubmit={onSubmit}>
        <label className="field">Correo electrónico<input type="email" name="email" defaultValue={prefill} autoComplete="email" required /></label>
        <FormMessage msg={msg} />
        <button className="btn btn--primary" type="submit" disabled={busy}>Enviar código</button>
      </form>
    </>
  );
}
