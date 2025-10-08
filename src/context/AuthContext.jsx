// context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔄 Charger la session depuis localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (savedUser && token) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        console.error('⚠️ Erreur parsing localStorage:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  // 🔑 LOGIN UNIFIÉ
  const login = async (credentials) => {
    try {
      const apiResponse = await authService.unifiedLogin(credentials)
      console.log('✅ Réponse API:', apiResponse)

      if (!apiResponse?.utilisateur || !apiResponse?.token) {
        throw new Error('Réponse API invalide')
      }

      const utilisateur = apiResponse.utilisateur

      // 🛡️ Normalisation du rôle
      let role = utilisateur.typecompte
      if (role) {
        role = role.toUpperCase().startsWith('ROLE_')
          ? role.toUpperCase()
          : `ROLE_${role.toUpperCase()}`
      }

      // Transformation pour le frontend
      const userInfo = {
        id: utilisateur.idu,
        email: utilisateur.emailu,
        role, // ← rôle toujours au format ROLE_*
        firstname: utilisateur.prenomu,
        lastname: utilisateur.nomu,
        phone: utilisateur.telephoneu,
        fonction: utilisateur.fonction,
        adresse: utilisateur.adresse,
        sexe: utilisateur.sexe,
        etat: utilisateur.etat,
        dateajout: utilisateur.dateajout,
        medecin: utilisateur.medecin, // si dispo
        token: apiResponse.token,
      }

      console.log('👤 Utilisateur stocké:', userInfo)

      // Sauvegarde session
      setUser(userInfo)
      localStorage.setItem('user', JSON.stringify(userInfo))
      localStorage.setItem('token', apiResponse.token)

      return userInfo
    } catch (error) {
      console.error('❌ Erreur login:', error)
      throw error
    }
  }

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  // 🔍 Helpers
  const hasRole = (role) => user?.role === role
  const isAuthenticated = () => !!user?.token
  const getToken = () => localStorage.getItem('token')

  // Raccourcis par rôle
  const isAdmin = () => hasRole('ROLE_ADMIN')
  const isMedecin = () => hasRole('ROLE_MEDECIN')
  const isSecretaire = () => hasRole('ROLE_SECRETAIRE')
  const isPatient = () => hasRole('ROLE_PATIENT')

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
    isPatient,
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
