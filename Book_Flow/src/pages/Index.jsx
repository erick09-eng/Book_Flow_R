import '../styles/index.css';
import '../components/product-card/product-card.css';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { books } from '../service/bookService';
import { users } from '../service/usersService';
import ProductCard from '../components/product-card/ProductCard';
import GoogleButton from '../components/google-button/GoogleButton';
import FormMessage from '../components/forms/FormMessage';

export default function Index() {
  usePageTitle('BookFlow - Inicio');
  const { user, openModal, signedIn } = useApp();
  const { search } = useLocation();
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (!user && new URLSearchParams(search).get('login')) openModal('auth');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const featured = [...books.all()].sort((a, b) => b.rating - a.rating).slice(0, 4);

  const onRegister = async (e) => {
    e.preventDefault();
    const r = await users.register(Object.fromEntries(new FormData(e.currentTarget)));
    r.ok ? signedIn() : setMsg({ text: r.error, ok: false });
  };

  return (
    <main>
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">Encuentra tu próxima gran <span className="hero__title-accent">historia</span></h1>
          <p className="hero__description">Explora un catálogo curado de literatura contemporánea y clásicos atemporales. Pide préstamos, guarda tus favoritos y mantén tu biblioteca personal organizada.</p>
          <Link to="/catalogo" className="hero__cta">Explorar catálogo <span aria-hidden="true">→</span></Link>
        </div>
        <div className="hero__stack" aria-hidden="true"><i></i><i></i><i></i></div>
      </section>

      <section className="recomendados">
        <div className="recomendados__header">
          <h2 className="recomendados__title">Lecturas recomendadas</h2>
          <Link to="/catalogo" className="recomendados__ver-todas">Ver todas →</Link>
        </div>
        <div className="grid" id="featured">
          {featured.map((b) => <ProductCard key={b.id} book={b} />)}
        </div>
      </section>

      <section className="pasos">
        <h2 className="pasos__title">Cómo funciona</h2>
        <div className="pasos__grid">
          <article className="paso"><h3>1. Crea tu cuenta</h3><p className="muted">Regístrate gratis para pedir libros y guardar tus favoritos.</p></article>
          <article className="paso"><h3>2. Elige tus libros</h3><p className="muted">Busca y filtra el catálogo por género, disponibilidad y calificación.</p></article>
          <article className="paso"><h3>3. Gestiona tu biblioteca</h3><p className="muted">Renueva o devuelve tus préstamos desde tu perfil.</p></article>
        </div>
      </section>

      <section className="register" id="register-section" hidden={!!user}>
        <div className="panel" id="registro">
          <a href="#" id="back-top" className="muted" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0 }); }}>← Atrás</a>
          <h2 className="panel__title">Crea tu cuenta</h2>
          <p className="muted">Regístrate para pedir libros y gestionar tus préstamos.</p>
          {!user && <GoogleButton id="google-register" />}
          <p className="divider"><span>o con tu correo</span></p>
          <form id="register-form" className="form" noValidate onSubmit={onRegister}>
            <label className="field">Nombre completo<input type="text" name="name" autoComplete="name" required /></label>
            <label className="field">Correo electrónico<input type="email" name="email" autoComplete="email" required /></label>
            <label className="field">Contraseña<input type="password" name="password" autoComplete="new-password" minLength={6} required /></label>
            <label className="field">Confirmar contraseña<input type="password" name="confirm" autoComplete="new-password" required /></label>
            <FormMessage msg={msg} />
            <button type="submit" className="btn btn--primary">Crear cuenta</button>
          </form>
        </div>
      </section>
    </main>
  );
}
