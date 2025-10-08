import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motdepasse: "",
    telephone: "",
    adresse: "",
    typecompte: "",
    dateNaissance: "",
    specialite: ""
  });

  const [error, setError] = useState("");

  // Gestion des champs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let payload = {
        emailu: formData.email,
        mdpu: formData.motdepasse,
        telephone: formData.telephone,
        adresse: formData.adresse,
        typecompte: formData.typecompte,
      };

      // Adapter selon le rôle
      if (formData.typecompte === "ROLE_PATIENT") {
        payload = {
          ...payload,
          nomp: formData.nom,
          prenomp: formData.prenom,
          datenaissance: formData.dateNaissance,
        };
      } else if (formData.typecompte === "ROLE_MEDECIN") {
        payload = {
          ...payload,
          nomu: formData.nom,
          prenomu: formData.prenom,
          specialite: formData.specialite,
        };
      } else {
        // Admin / Secretaire
        payload = {
          ...payload,
          nomu: formData.nom,
          prenomu: formData.prenom,
        };
      }

      await axios.post("http://localhost:8081/api/auth/register", payload);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'inscription. Vérifiez vos informations.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Inscription</h2>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Nom */}
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={formData.nom}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Prénom */}
        <input
          type="text"
          name="prenom"
          placeholder="Prénom"
          value={formData.prenom}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Mot de passe */}
        <input
          type="password"
          name="motdepasse"
          placeholder="Mot de passe"
          value={formData.motdepasse}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Téléphone */}
        <input
          type="text"
          name="telephone"
          placeholder="Téléphone"
          value={formData.telephone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Adresse */}
        <input
          type="text"
          name="adresse"
          placeholder="Adresse"
          value={formData.adresse}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Type de compte */}
        <select
          name="typecompte"
          value={formData.typecompte}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">-- Sélectionnez un type de compte --</option>
          <option value="ROLE_PATIENT">Patient</option>
          <option value="ROLE_MEDECIN">Médecin</option>
          <option value="ROLE_SECRETAIRE">Secrétaire</option>
          <option value="ROLE_ADMIN">Admin</option>
        </select>

        {/* Champs spécifiques */}
        {formData.typecompte === "ROLE_PATIENT" && (
          <input
            type="date"
            name="dateNaissance"
            value={formData.dateNaissance}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        )}

        {formData.typecompte === "ROLE_MEDECIN" && (
          <input
            type="text"
            name="specialite"
            placeholder="Spécialité"
            value={formData.specialite}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}
