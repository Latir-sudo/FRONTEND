import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaUser, FaUserMd, FaUserShield, FaUserInjured } from 'react-icons/fa';

export default function CreateUser() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        prenomu: '',
        nomu: '',
        emailu: '',
        telephoneu: '',
        sexe: '',
        adresse: '',
        fonction: '',
        typecompte: 'ROLE_PATIENT',
        password: '',
        confirmPassword: '',
        etat: 'actif',
        specialite: ''
    });

    const getFonctionSuggestions = (typecompte) => {
        const suggestions = {
            'ROLE_ADMIN': 'Administrateur système',
            'ROLE_MEDECIN': 'Médecin',
            'ROLE_SECRETAIRE': 'Secrétaire médicale',
            'ROLE_PATIENT': 'Patient'
        };
        return suggestions[typecompte] || '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'typecompte') {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                fonction: getFonctionSuggestions(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        // Validation
        if (formData.password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        if (formData.typecompte === 'ROLE_MEDECIN' && !formData.specialite) {
            setError("La spécialité est obligatoire pour un médecin");
            return;
        }

        setLoading(true);

        try {
            const API_URL = 'http://localhost:3001';
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Authentication required');
            }

            const userData = {
                prenomu: formData.prenomu,
                nomu: formData.nomu,
                emailu: formData.emailu,
                telephoneu: formData.telephoneu,
                sexe: formData.sexe,
                adresse: formData.adresse,
                fonction: formData.fonction,
                typecompte: formData.typecompte,
                password: formData.password,
                etat: formData.etat,
                ...(formData.typecompte === 'ROLE_MEDECIN' && {
                    specialite: formData.specialite
                })
            };

            const response = await fetch(`${API_URL}/api/utilisateurs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                let errorMessage = errorData.error || `Erreur ${response.status}`;
                
                if (response.status === 400) {
                    errorMessage = errorData.error || 'Données invalides';
                } else if (response.status === 401) {
                    errorMessage = 'Session expirée';
                    setTimeout(() => navigate('/login'), 2000);
                } else if (response.status === 403) {
                    errorMessage = 'Droits administrateur requis';
                } else if (response.status === 409) {
                    errorMessage = 'Cet email est déjà utilisé';
                }
                
                throw new Error(errorMessage);
            }

            // Succès
            setSuccess(true);
            setTimeout(() => {
                navigate('/admin/users');
            }, 1500);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // [Les fonctions getTypeIcon et getTypeLabel restent identiques]

    return (
        <div className="bg-white rounded-xl p-6 shadow-md">
            {/* En-tête */}
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={() => navigate('/admin/users')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                    <FaArrowLeft />
                    Retour
                </button>
                <div>
                    <h1 className="text-xl font-bold">Créer un nouvel utilisateur</h1>
                    <p className="text-sm text-gray-600">Ajouter un nouvel utilisateur au système</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                    ✅ Utilisateur créé avec succès ! Redirection...
                </div>
            )}

            {/* [Le reste du formulaire reste identique] */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Votre formulaire existant... */}
            </form>
        </div>
    );
}