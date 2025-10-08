import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    adress: "",
    role: "PATIENT", // valeur par défaut
    // Champs spécifiques
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    allergies: "",
    antecedents: "",
    specialty: "",
    locality: "",
    cabinetAddress: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Préparer les données à envoyer
      let payload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        adress: formData.adress,
        role: formData.role.toUpperCase(),
      };

      if (formData.role === "PATIENT") {
        payload = {
          ...payload,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          bloodType: formData.bloodType,
          allergies: formData.allergies,
          antecedents: formData.antecedents,
        };
      }

      if (formData.role === "DOCTOR") {
        payload = {
          ...payload,
          specialty: formData.specialty,
          locality: formData.locality,
          cabinetAddress: formData.cabinetAddress,
        };
      }

      // Envoi au backend
      const res = await axios.post("http://localhost:5000/api/auth/register", payload);
      alert("Inscription réussie !");
      console.log(res.data);

    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 shadow-lg rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">Créer un compte</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Champs communs */}
        <input
          type="text"
          name="firstname"
          placeholder="Prénom"
          value={formData.firstname}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="lastname"
          placeholder="Nom"
          value={formData.lastname}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Téléphone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="adress"
          placeholder="Adresse"
          value={formData.adress}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        {/* Sélection du rôle */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Docteur</option>
        </select>

        {/* Champs spécifiques Patient */}
        {formData.role === "PATIENT" && (
          <>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Sexe --</option>
              <option value="MALE">Homme</option>
              <option value="FEMALE">Femme</option>
            </select>
            <input
              type="text"
              name="bloodType"
              placeholder="Groupe sanguin (ex: O+)"
              value={formData.bloodType}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="allergies"
              placeholder="Allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="antecedents"
              placeholder="Antécédents médicaux"
              value={formData.antecedents}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </>
        )}

        {/* Champs spécifiques Docteur */}
        {formData.role === "DOCTOR" && (
          <>
            <input
              type="text"
              name="specialty"
              placeholder="Spécialité"
              value={formData.specialty}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              name="locality"
              placeholder="Localité"
              value={formData.locality}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              name="cabinetAddress"
              placeholder="Adresse du cabinet"
              value={formData.cabinetAddress}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          S’inscrire
        </button>
      </form>
    </div>
  );
}
