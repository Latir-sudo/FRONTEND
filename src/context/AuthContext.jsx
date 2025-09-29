// context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (savedUser && token) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  // 🔑 FONCTION LOGIN UNIFIÉE
  const login = async (credentials) => {
    console.log('🔐 Début du processus de login unifié')
    
    try {
      const apiResponse = await authService.unifiedLogin(credentials)
      console.log('✅ Réponse API reçue:', apiResponse)

      if (!apiResponse || !apiResponse.utilisateur || !apiResponse.token) {
        throw new Error('Format de réponse API invalide')
      }

      const utilisateur = apiResponse.utilisateur
      
      // DEBUG: Vérifier le token
      try {
        const decodedToken = JSON.parse(atob(apiResponse.token.split('.')[1]))
        console.log('🔐 Token décodé:', decodedToken)
      } catch (e) {
        console.log('⚠️ Impossible de décoder le token:', e)
      }

      // Transformation pour le frontend - TOUJOURS utiliser typecompte
      const userInfo = {
        // Champs transformés
        id: utilisateur.idu,
        email: utilisateur.emailu,  
        role: utilisateur.typecompte, // ← IMPORTANT: vient de typecompte
        firstname: utilisateur.prenomu,
        lastname: utilisateur.nomu,
        phone: utilisateur.telephoneu,
        fonction: utilisateur.fonction,
        adresse: utilisateur.adresse,
        sexe: utilisateur.sexe,
        etat: utilisateur.etat,
        dateajout: utilisateur.dateajout,
        
        // Données médecin si disponibles
        medecin: utilisateur.medecin,
        
        // Token
        token: apiResponse.token,
      }

      console.log('👤 Utilisateur après transformation:', userInfo)
      
      setUser(userInfo)
      localStorage.setItem('user', JSON.stringify(userInfo))
      localStorage.setItem('token', apiResponse.token)

      return userInfo
    } catch (error) {
      console.error('❌ Erreur lors du login:', error)
      throw error
    }
  }

  // 🚪 FONCTION LOGOUT
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  // 🔍 FONCTIONS UTILITAIRES
  const hasRole = (role) => user?.role === role
  const isAuthenticated = () => !!user && !!user.token
  const getToken = () => localStorage.getItem('token')
  const isAdmin = () => user?.role === 'ROLE_ADMIN'
  const isMedecin = () => user?.role === 'ROLE_MEDECIN'
  const isSecretaire = () => user?.role === 'ROLE_SECRETAIRE'
  const isPatient = () => user?.role === 'ROLE_PATIENT'

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated,
    getToken,
    isAdmin,
    isMedecin,
    isSecretaire,
    isPatient
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}