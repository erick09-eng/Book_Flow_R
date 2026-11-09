import { Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Index from './pages/Index';
import Catalogo from './pages/Catalogo';
import Biblioteca from './pages/Biblioteca';
import Cuenta from './pages/Cuenta';

// Las 4 vistas del proyecto: inicio, catálogo, biblioteca (con favoritos) y perfil
export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/cuenta" element={<Cuenta />} />
            <Route path="/biblioteca" element={<Biblioteca />} />
          </Route>
          <Route path="*" element={<Index />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}
