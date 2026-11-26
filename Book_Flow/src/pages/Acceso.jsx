import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { users } from '../service/usersService';
import { useApp } from '../context/AppContext';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import GoogleButton from '../components/google-button/GoogleButton';
import '../styles/acceso.css';

export default function Acceso() {
  const [searchParams] = useSearchParams();
  const { toast, signedIn } = useApp();
  const [mode, setMode] = useState(searchParams.get('mode') || 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    code: '',
  });

  usePageTitle('BookFlow - Acceso');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validateLogin = () => {
    if (!form.email || !form.password) {
      setError('Completa todos los campos.');
      return false;
    }
    return true;
  };

  const validateRegister = () => {
    if (!form.name || form.name.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres.');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Correo inválido.');
      return false;
    }
    if (!form.password || form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.');
      return false;
    }
    return true;
  };

  const validateResetRequest = () => {
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Correo inválido.');
      return false;
    }
    return true;
  };

  const validateResetConfirm = () => {
    if (!form.code || form.code.length !== 6) {
      setError('Código de 6 dígitos requerido.');
      return false;
    }
    if (!form.password || form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (mode === 'login') {
      if (!validateLogin()) { setLoading(false); return; }
      result = await users.login(form.email, form.password);
    } else if (mode === 'register') {
      if (!validateRegister()) { setLoading(false); return; }
      result = await users.register({
        name: form.name,
        email: form.email,
        password: form.password,
        confirm: form.confirm,
      });
    } else if (mode === 'reset-request') {
      if (!validateResetRequest()) { setLoading(false); return; }
      result = await users.requestReset(form.email);
      if (result.ok) {
        toast('Si el correo existe, recibirás un código de recuperación.', true);
        setMode('reset-confirm');
        setForm((prev) => ({ ...prev, code: '', password: '', confirm: '' }));
      } else {
        toast(result.error, false);
      }
      setLoading(false);
      return;
    } else if (mode === 'reset-confirm') {
      if (!validateResetConfirm()) { setLoading(false); return; }
      result = await users.resetPassword(form.email, form.code, form.password, form.confirm);
    }

    if (result.ok) {
      if (mode === 'reset-confirm') {
        toast('Contraseña actualizada. Inicia sesión.', true);
        setMode('login');
        setForm({ name: '', email: '', password: '', confirm: '', code: '' });
      } else {
        signedIn();
      }
    } else {
      setError(result.error);
      toast(result.error, false);
    }
    setLoading(false);
  };

  

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setForm({ name: '', email: '', password: '', confirm: '', code: '' });
  };

  const renderLogin = () => (
    <form onSubmit={handleSubmit} noValidate>
      <Form.Group className="mb-3">
        <Form.Label>Correo electrónico</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
          placeholder="tu@correo.com"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
          placeholder="••••••••"
        />
      </Form.Group>
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      <Button type="submit" variant="primary" className="w-100 mb-2" disabled={loading}>
        {loading ? 'Entrando…' : 'Iniciar sesión'}
      </Button>
      <div className="mb-2">
        <GoogleButton id="google-login-acceso" />
      </div>
      <p className="text-center mt-3 mb-0 small">
        ¿No tienes cuenta?{' '}
        <button type="button" className="link-underline" onClick={() => switchMode('register')}>
          Regístrate
        </button>
      </p>
      <p className="text-center mt-2 small">
        <button type="button" className="link-underline" onClick={() => switchMode('reset-request')}>
          ¿Olvidaste tu contraseña?
        </button>
      </p>
    </form>
  );

  const renderRegister = () => (
    <form onSubmit={handleSubmit} noValidate>
      <Form.Group className="mb-3">
        <Form.Label>Nombre completo</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          autoComplete="name"
          placeholder="Tu nombre"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Correo electrónico</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
          placeholder="tu@correo.com"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          placeholder="Mín. 6 caracteres"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Confirmar contraseña</Form.Label>
        <Form.Control
          type="password"
          name="confirm"
          value={form.confirm}
          onChange={handleChange}
          required
          autoComplete="new-password"
          placeholder="Repite la contraseña"
        />
      </Form.Group>
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      <Button type="submit" variant="primary" className="w-100 mb-2" disabled={loading}>
        {loading ? 'Creando cuenta…' : 'Crear cuenta'}
      </Button>
      <div className="mb-2">
        <GoogleButton id="google-register-acceso" />
      </div>
      <p className="text-center mt-3 mb-0 small">
        ¿Ya tienes cuenta?{' '}
        <button type="button" className="link-underline" onClick={() => switchMode('login')}>
          Inicia sesión
        </button>
      </p>
    </form>
  );

  const renderResetRequest = () => (
    <form onSubmit={handleSubmit} noValidate>
      <p className="text-muted mb-4">
        Introduce tu correo y te enviaremos un código de 6 dígitos para restablecer la contraseña.
      </p>
      <Form.Group className="mb-3">
        <Form.Label>Correo electrónico</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
          placeholder="tu@correo.com"
        />
      </Form.Group>
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      <Button type="submit" variant="primary" className="w-100 mb-2" disabled={loading}>
        {loading ? 'Enviando…' : 'Enviar código'}
      </Button>
      <p className="text-center mt-3 mb-0 small">
        <button type="button" className="link-underline" onClick={() => switchMode('login')}>
          Volver al inicio de sesión
        </button>
      </p>
    </form>
  );

  const renderResetConfirm = () => (
    <form onSubmit={handleSubmit} noValidate>
      <p className="text-muted mb-4">
        Introduce el código de 6 dígitos que recibiste por correo y tu nueva contraseña.
      </p>
      <Form.Group className="mb-3">
        <Form.Label>Código de 6 dígitos</Form.Label>
        <Form.Control
          type="text"
          name="code"
          value={form.code}
          onChange={handleChange}
          required
          maxLength={6}
          autoComplete="one-time-code"
          placeholder="123456"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Nueva contraseña</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          placeholder="Mín. 6 caracteres"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Confirmar contraseña</Form.Label>
        <Form.Control
          type="password"
          name="confirm"
          value={form.confirm}
          onChange={handleChange}
          required
          autoComplete="new-password"
          placeholder="Repite la contraseña"
        />
      </Form.Group>
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      <Button type="submit" variant="primary" className="w-100 mb-2" disabled={loading}>
        {loading ? 'Actualizando…' : 'Actualizar contraseña'}
      </Button>
      <p className="text-center mt-3 mb-0 small">
        <button type="button" className="link-underline" onClick={() => switchMode('login')}>
          Volver al inicio de sesión
        </button>
      </p>
    </form>
  );

  return (
    <main className="acceso">
      <div className="acceso__card">
        <div className="acceso__header">
          <h1>BookFlow</h1>
          <p className="text-muted">Accede a tu biblioteca personal</p>
        </div>
        <div className="acceso__body">
          {mode === 'login' && renderLogin()}
          {mode === 'register' && renderRegister()}
          {mode === 'reset-request' && renderResetRequest()}
          {mode === 'reset-confirm' && renderResetConfirm()}
        </div>
      </div>
    </main>
  );
}