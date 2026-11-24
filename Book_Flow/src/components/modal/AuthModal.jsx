import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { users } from '../../service/usersService';
import GoogleButton from '../google-button/GoogleButton';
import FormMessage from '../forms/FormMessage';

export default function AuthModal() {
  const { openModal, closeModal, signedIn } = useApp();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const formRef = useRef(null);
  const [msg, setMsg] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    const r = await users.login(d.email, d.password);
    r.ok ? signedIn() : setMsg({ text: r.error, ok: false });
  };

  const goRegister = () => {
    closeModal();
    pathname === '/' ? document.getElementById('registro')?.scrollIntoView() : navigate('/#registro');
  };

  return (
    <>
      <h2>Iniciar sesión</h2>
      <p className="muted">Accede para pedir libros y guardar tus favoritos.</p>
      <GoogleButton id="google-login" />
      <p className="divider"><span>o con tu correo</span></p>
      <form className="form" id="login-form" noValidate ref={formRef} onSubmit={onSubmit}>
        <label className="field">Correo electrónico<input type="email" name="email" autoComplete="email" required /></label>
        <label className="field">Contraseña<input type="password" name="password" autoComplete="current-password" required /></label>
        <FormMessage msg={msg} />
        <button className="btn btn--primary" type="submit">Ingresar</button>
      </form>
      <button type="button" className="link" onClick={() => openModal('forgot', { prefill: formRef.current.elements.email.value.trim() })}>¿Olvidaste tu contraseña?</button>
      <p className="muted">¿No tienes cuenta? <button className="link" onClick={goRegister}>Registrarse</button></p>
    </>
  );
}
