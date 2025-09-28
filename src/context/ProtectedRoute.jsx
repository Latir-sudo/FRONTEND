// ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  // Non connecté -> renvoyer vers /login en gardant la route demandée
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Connecté mais rôle non autorisé -> renvoyer à la racine (ou page d'erreur)
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Tout est ok -> rendre les routes enfants
  return <Outlet />;
}
