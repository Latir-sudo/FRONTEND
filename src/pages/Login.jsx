// pages/Login.jsx
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('🚀 Début de la connexion unifiée...')
      
      // Utilisation du login unifié
      const userData = await login({ email, password })
      
      console.log('✅ Login réussi, redirection...', userData)

      // Redirection selon le rôle (qui vient de typecompte)
      const destinations = {
        'ROLE_ADMIN': '/admin',
        'ROLE_MEDECIN': '/medecin/dashboard', 
        'ROLE_SECRETAIRE': '/secretaire/dashboard',
        'ROLE_PATIENT': '/patient/dashboard'
      }
      
      const dest = destinations[userData.role] || '/'
      console.log(`📍 Redirection vers: ${dest} (rôle: ${userData.role})`)
      nav(dest, { replace: true })
      
    } catch (err) {
      console.error('❌ Erreur de connexion:', err)
      setError(err.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
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
              {error}
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connexion...
                </>
              ) : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Pas de compte ?{' '}
              <Link 
                className="text-blue-600 hover:text-blue-700 font-medium" 
                to="/register"
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