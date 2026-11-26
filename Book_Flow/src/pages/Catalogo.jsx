import '../styles/catalogo.css';
import { usePageTitle } from '../hooks/usePageTitle';
import Browse from '../components/browse/Browse';

export default function Catalogo() {
  usePageTitle('BookFlow - Catálogo');
  return (
    <main className="catalog">
      <h1 className="page-title">Catálogo</h1>
      <div id="browse"><Browse /></div>
    </main>
  );
}
