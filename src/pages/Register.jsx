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

    // Type de compte
    typecompte: 'ROLE_PATIENT', // valeur par défaut

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
      const API_URL = 'http://localhost:3001'

      // Déterminer si c'est un patient ou un médecin
      const isPatient = formData.typecompte === 'ROLE_PATIENT'
      const endpoint = isPatient ? '/api/patients' : '/api/utilisateurs'

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
        // Modèle Médecin
        prenomu: formData.prenom,
        nomu: formData.nom,
        telephoneu: formData.telephone,
        emailu: formData.email,
        password: formData.password,
        sexe: formData.sexe,
        adresse: formData.adresse,
        fonction: formData.fonction,
        etat: 'actif',
        typecompte: 'ROLE_MEDECIN',
        specialite: formData.specialite
      }

      console.log('📤 Données envoyées:', requestData)

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Erreur lors de l'inscription (${response.status})`)
      }

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
          <h2 className="h2 text-center">Créer un compte</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Type de compte */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de compte *</label>
              <select
                name="typecompte"
                value={formData.typecompte}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              >
                <option value="ROLE_PATIENT">Patient</option>
                <option value="ROLE_MEDECIN">Médecin</option>
              </select>
            </div>

            {/* ... (ici tes autres champs inchangés) */}

            {/* Afficher les champs spécifiques */}
            {formData.typecompte === 'ROLE_PATIENT' && (
              <>
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
              </>
            )}

            {formData.typecompte === 'ROLE_MEDECIN' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité *</label>
                  <input
                    type="text"
                    name="specialite"
                    value={formData.specialite}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
              </>
            )}

            {/* Mot de passe etc... */}

            <div className="md:col-span-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Inscription en cours...' : 'Créer mon compte'}
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  )
}
