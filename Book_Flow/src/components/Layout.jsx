import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './header/Header';
import Footer from './footer/Footer';
import ModalRoot from './modal/ModalRoot';
import Toast from './toast/Toast';

// Al cambiar de vista se vuelve arriba (o al ancla #registro), como pasaba al cargar otra página HTML
function ScrollManager() {
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, search, hash]);
  return null;
}

// Header y footer compartidos por todas las vistas
export default function Layout() {
  return (
    <>
      <ScrollManager />
      <Header />
      <Outlet />
      <Footer />
      <ModalRoot />
      <Toast />
    </>
  );
}
