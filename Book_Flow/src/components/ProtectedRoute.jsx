import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Rutas protegidas: sin sesión se vuelve al inicio con el login abierto
export default function ProtectedRoute() {
  const { user } = useApp();
  return user ? <Outlet /> : <Navigate to="/?login=1" replace />;
}
