// components/ProtectedRoute.jsx
import { useAuth } from '../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  requiredRoles = [] 
}) {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  // ⏳ En cours de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    )
  }

  // 🔐 Non authentifié - redirection vers login
  if (!isAuthenticated()) {
    console.log('❌ Non authentifié, redirection vers /login')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 🎯 Vérification des rôles si requis
  if (requiredRole || requiredRoles.length > 0) {
    const rolesToCheck = requiredRole ? [requiredRole] : requiredRoles
    const hasRequiredRole = rolesToCheck.some(role => user?.role === role)
    
    if (!hasRequiredRole) {
      console.log(`❌ Rôle insuffisant. Requis: ${rolesToCheck.join(', ')}, Actuel: ${user?.role}`)
      
      // Redirection selon le rôle actuel
      const roleDestinations = {
        'ROLE_ADMIN': '/admin',
        'ROLE_MEDECIN': '/medecin/dashboard',
        'ROLE_SECRETAIRE': '/secretaire/dashboard', 
        'ROLE_PATIENT': '/patient/dashboard'
      }
      
      const dest = roleDestinations[user?.role] || '/unauthorized'
      return <Navigate to={dest} replace />
    }
  }

  // ✅ Accès autorisé
  console.log(`✅ Accès autorisé pour ${user?.role}`)
  return children
}