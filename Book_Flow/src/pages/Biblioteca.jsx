import '../styles/biblioteca.css';
import { useSearchParams } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import AccountTabs from '../components/tabs/AccountTabs';
import Browse from '../components/browse/Browse';

// "Mi biblioteca" (préstamos activos) y "Favoritos" son la misma vista con distinta pestaña
export default function Biblioteca() {
  usePageTitle('BookFlow - Mi biblioteca');
  const [params] = useSearchParams();
  const tab = params.get('tab') === 'favs' ? 'favs' : 'loans';
  return (
    <main className="library">
      <AccountTabs />
      <h1 className="page-title" id="title">{tab === 'favs' ? 'Favoritos' : 'Mi biblioteca'}</h1>
      <div id="browse"><Browse key={tab} isLib tab={tab} /></div>
    </main>
  );
}
