import { Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Index from './pages/Index';
import Catalogo from './pages/Catalogo';
import Biblioteca from './pages/Biblioteca';
import Cuenta from './pages/Cuenta';
import Detalle from './pages/Detalle';
import Acceso from './pages/Acceso';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/libro/:id" element={<Detalle />} />
          <Route path="/acceso" element={<Acceso />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/cuenta" element={<Cuenta />} />
            <Route path="/biblioteca" element={<Biblioteca />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}
