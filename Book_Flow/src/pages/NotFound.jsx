import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import Button from 'react-bootstrap/Button';
import '../styles/notfound.css';

export default function NotFound() {
  usePageTitle('BookFlow - Página no encontrada');

  return (
    <main className="notfound">
      <div className="notfound__content">
        <h1 className="notfound__code">404</h1>
        <h2 className="notfound__title">Página no encontrada</h2>
        <p className="notfound__text">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link to="/" className="notfound__link">
          <Button variant="primary" size="lg">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </main>
  );
}