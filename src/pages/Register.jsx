// pages/Register.jsx
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Register() {
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    // Champs communs
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    sexe: '',
    adresse: '',
    
    // Champs patient
    date_naissance: '',
    commune: '',
    personne_urgence: '',
    langue_pref: 'fr',
    
    // Champs médecin
    specialite: '',
    fonction: 'Médecin',
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      setLoading(false)
      return
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'

      // Déterminer l'endpoint en fonction du rôle
      const isPatient = true // Pour l'instant, on permet seulement l'inscription patient
      const endpoint = isPatient ? '/api/patients' : '/api/utilisateurs'

      // Préparer les données selon le modèle
      const requestData = isPatient ? {
        // Modèle Patient
        prenom: formData.prenom,
        nom: formData.nom,
        telephone: formData.telephone,
        email: formData.email,
        password: formData.password,
        sexe: formData.sexe,
        date_naissance: formData.date_naissance,
        adresse: formData.adresse,
        commune: formData.commune,
        personne_urgence: formData.personne_urgence,
        langue_pref: formData.langue_pref,
        typecompte: 'ROLE_PATIENT'
      } : {
        // Modèle Utilisateur (médecin/admin/secrétaire)
        prenomu: formData.prenom,
        nomu: formData.nom,
        telephoneu: formData.telephone,
        emailu: formData.email,
        password: formData.password,
        sexe: formData.sexe,
        adresse: formData.adresse,
        fonction: formData.fonction,
        etat: 'actif',
        typecompte: 'ROLE_MEDECIN', // ou autre rôle
        // Champs médecin
        ...(formData.fonction === 'Médecin' && {
          specialite: formData.specialite
        })
      }

      console.log('📤 Données envoyées:', requestData)

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Erreur lors de l'inscription (${response.status})`)
      }

      // Inscription réussie
      console.log('✅ Inscription réussie:', data)
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.')
      nav('/login')
      
    } catch (err) {
      console.error('❌ Erreur inscription:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div>
      <Navbar />
      <section className="section">
        <div className="max-w-2xl mx-auto card">
          <h2 className="h2 text-center">Créer un compte Patient</h2>

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 text-center">
              📝 Inscription Patient - Les médecins doivent être créés par un administrateur
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Informations personnelles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
              <select
                name="sexe"
                value={formData.sexe}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
              <input
                type="date"
                name="date_naissance"
                value={formData.date_naissance}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commune</label>
              <input
                type="text"
                name="commune"
                value={formData.commune}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Personne à contacter en urgence</label>
              <input
                type="text"
                name="personne_urgence"
                value={formData.personne_urgence}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Langue préférée</label>
              <select
                name="langue_pref"
                value={formData.langue_pref}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
                minLength="6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div className="md:col-span-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Inscription en cours...
                  </>
                ) : 'Créer mon compte Patient'}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Déjà un compte ?{' '}
              <Link 
                className="text-green-700 hover:text-green-800 font-medium" 
                to="/login"
              >
                Se connecter
              </Link>
            </p>
          </div>

          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              💡 Pour devenir médecin sur la plateforme, veuillez contacter l'administration.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}