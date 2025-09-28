// Sidebar.jsx
import { useState } from "react";
import {Link , NavLink} from 'react-router-dom'
import { FaHeartbeat, FaTachometerAlt, FaUsers, FaCreditCard, FaChartLine, FaUserMd, FaFileAlt, FaCog } from "react-icons/fa";

export default function Sidebar({ active, setActive }) {
  const menuItems = [
  { id: "dashboard", label: "Tableau de bord", icon: <FaTachometerAlt />, path: "/admin" },
  { id: "users", label: "Gestion des utilisateurs", icon: <FaUsers />, path: "/admin/users" },
  { id: "payments", label: "Supervision des paiements", icon: <FaCreditCard />, path: "/admin/paiements" },
  { id: "quality", label: "Qualité de service", icon: <FaChartLine />, path: "/admin/qualite" },
  { id: "doctors", label: "Gestion médecins", icon: <FaUserMd />, path: "/admin/medecins" },
  { id: "reports", label: "Rapports nationaux", icon: <FaFileAlt />, path: "/admin/rapports" },
  { id: "settings", label: "Paramètres système", icon: <FaCog />, path: "/admin/parametres" },
];


  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-600 to-blue-900 text-white p-6">
      <div className="flex items-center gap-3 mb-10">
        <FaHeartbeat className="text-3xl text-green-400" />
        <div className="font-bold text-lg">Clinique<br /><small className="text-sm">Connect</small></div>
      </div>
      <ul className="space-y-2">
  {menuItems.map(item => (
    <li key={item.id}>
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-3 p-3 rounded-lg transition cursor-pointer ${
            isActive ? "bg-white/20" : "hover:bg-white/10"
          }`
        }
      >
        {item.icon}
        {item.label}
      </NavLink>
    </li>
  ))}
</ul>

    </aside>
  );
}


