// pages/Login.jsx
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const from = loc.state?.from?.pathname || null

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 🔐 APPEL À VOTRE API - Format exact de votre backend
      const apiResponse = await authenticateUser(email, password)
      
      // Utiliser la réponse complète de l'API
      login(apiResponse)
      
      // Redirection selon le rôle
      const destinations = {
        'ADMIN': '/admin',
        'DOCTOR': '/medecin', 
        'PATIENT': '/patient'
      }
      
      const dest = from || destinations[apiResponse.user.role] || '/'
      nav(dest, { replace: true })
      
    } catch (err) {
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  // 🔐 FONCTION D'AUTHENTIFICATION - Adaptée à votre API
  const authenticateUser = async (email, password) => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password: password
      })
    })

    const data = await response.json()

    if (!response.ok) {
      // Gestion des erreurs basée sur votre API
      switch (response.status) {
        case 400:
          throw new Error(data.message || 'Email ou mot de passe incorrect')
        case 500:
          throw new Error('Erreur serveur, veuillez réessayer')
        default:
          throw new Error(data.message || `Erreur ${response.status}`)
      }
    }

    // Vérification du format de réponse
    if (data.message === "Login successful" && data.user && data.token) {
      return data // Retourner toute la réponse API
    } else {
      throw new Error('Réponse invalide du serveur')
    }
  }

  return (
    <div>
      <Navbar />
      <section className="section">
        <div className="max-w-md mx-auto card">
          <h2 className="h2 text-center">Connexion</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <div className="flex items-center gap-2">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="votre@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                placeholder="Votre mot de passe"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-200 transition-colors"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connexion en cours...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Se connecter
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Pas de compte ?{' '}
              <Link 
                className="text-green-700 hover:text-blue-700 font-medium" 
                to="/inscription"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}