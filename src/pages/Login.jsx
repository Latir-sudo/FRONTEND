import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // --- Fonction Register ---
  const register = async (formData) => {
    try {
      // formData doit contenir: nom, prenom, email, password, genre, role
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        genre: formData.genre,
        role: formData.role, // patient ou medecin
      });

      setUser(res.data.user); // suppose que backend renvoie user
      return res.data;
    } catch (error) {
      console.error("Erreur Register :", error.response?.data || error.message);
      throw error;
    }
  };

  // --- Fonction Login ---
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      console.error("Erreur Login :", error.response?.data || error.message);
      throw error;
    }
  };

  // --- Fonction Logout ---
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
