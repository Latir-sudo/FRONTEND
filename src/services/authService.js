// services/authService.js
class AuthService {
  constructor() {
    this.baseURL =  'http://localhost:3001/api';
  }

  async unifiedLogin(credentials) {
    const { email, password } = credentials;
    
    if (!email || !password) {
      throw new Error('Email et mot de passe sont requis');
    }

    console.log('🔐 Tentative de connexion unifiée pour:', email);

    // 1ère tentative : Modèle Utilisateur
    try {
      console.log('🔄 Tentative de connexion Utilisateur...');
      const userResponse = await this.loginUtilisateur(email, password);
      console.log('✅ Connexion Utilisateur réussie');
      return this.formatUserResponse(userResponse, 'utilisateur');
    } catch (userError) {
      console.log('❌ Échec connexion Utilisateur:', userError.message);
      
      // 2ème tentative : Modèle Patient
      try {
        console.log('🔄 Tentative de connexion Patient...');
        const patientResponse = await this.loginPatient(email, password);
        console.log('✅ Connexion Patient réussie');
        return this.formatUserResponse(patientResponse, 'patient');
      } catch (patientError) {
        console.log('❌ Échec connexion Patient:', patientError.message);
        throw new Error('Identifiants incorrects');
      }
    }
  }

  async loginUtilisateur(email, password) {
    const response = await fetch(`${this.baseURL}/utilisateurs/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailu: email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Identifiants utilisateur invalides');
    }

    return await response.json();
  }

  async loginPatient(email, password) {
    const response = await fetch(`${this.baseURL}/patients/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Identifiants patient invalides');
    }

    return await response.json();
  }

  formatUserResponse(apiResponse, userType) {
    if (userType === 'utilisateur') {
      return {
        token: apiResponse.token,
        utilisateur: {
          ...apiResponse.user,
          // Garantir que typecompte est toujours présent
          idu: apiResponse.user?.idu,
          emailu: apiResponse.user?.emailu,
          typecompte: apiResponse.user?.typecompte, // ← TOUJOURS typecompte
          prenomu: apiResponse.user?.prenomu,
          nomu: apiResponse.user?.nomu,
          telephoneu: apiResponse.user?.telephoneu,
          fonction: apiResponse.user?.fonction,
          adresse: apiResponse.user?.adresse,
          sexe: apiResponse.user?.sexe,
          etat: apiResponse.user?.etat,
          dateajout: apiResponse.user?.dateajout,
          medecin: apiResponse.user?.medecin
        }
      };
    } else {
      // Patient - Normaliser sur typecompte
      return {
        token: apiResponse.token,
        utilisateur: {
          idu: apiResponse.patient?.id_patient,
          emailu: apiResponse.patient?.email,
          typecompte: apiResponse.patient?.typecompte || 'ROLE_PATIENT', // ← typecompte
          prenomu: apiResponse.patient?.prenom,
          nomu: apiResponse.patient?.nom,
          telephoneu: apiResponse.patient?.telephone,
          fonction: 'Patient',
          adresse: apiResponse.patient?.adresse,
          sexe: apiResponse.patient?.sexe,
          etat: 'actif',
          dateajout: apiResponse.patient?.cree_le
        }
      };
    }
  }
}

export default new AuthService();