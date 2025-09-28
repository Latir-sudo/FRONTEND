import { useState } from "react";

import {FaEdit} from 'react-icons/fa';


export default function GestionUsers () {
    const [search,setsearch] = useState("");


    // les utilisateurs , leur informations

    const users = [
        {
            id: 1,
            name: "Francois Diouf",
            email : "francois@gamail.com",
            type: "Patient",
            region:"Dakar",
            date: "23/11/2025",
            status:"Actif",
        },
        {
            id: 2,
            name: "Mariama Sarr",
            email : "mariama@gamail.com",
            type: "Medecin",
            region:"Saint-Louis",
            date: "10/12/2025",
            status:"Inactif",
        },
        {
            id: 3,
            name: "Aminata Colle",
            email : "colleaminata@gamail.com",
            type: "Patient",
            region:"Thiés",
            date: "10/12/2025",
            status:"actif",
        },
        {
            id: 4,
            name: "ABdou Diop",
            email : "diopabdou@gamail.com",
            type: "Medecin",
            region:"Fatick",
            date: "12/10/2024",
            status:"Inactif",
        },
        {
            id: 5,
            name: "Astou Ndiaye",
            email : "astoundiaye@gamail.com",
            type: "Medecin",
            region:"Louga",
            date: "10/12/2025",
            status:"Inactif",
        }
    ];

    const filterdUsers = users.filter (
         (u)=> 
            u.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
            u.email.toLocaleLowerCase().includes(search.toLocaleLowerCase()) 
    );


    return (
        <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold">Gestion des utilisateurs</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="rechercher"
                        value={search}
                        onChange={(e)=> setsearch(e.target.value)}
                        className="border border-gray-600 rounded-lg px-3 text-sm"

                        />
                        <button className="bg-blue-400 text-white px-3 py-2 rounded-xl text-sm hover:bg-blue-600">
                            Nouvel utilisateur
                        </button>
                </div>
            </div>

            <table className="w-full text-sm text-left" >
                 <thead className="bg-gray-200">
                    <tr>
                        <th className="p-3">Utilisateur</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Region</th>
                        <th className="p-3">Date d'inscription</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Actions</th>
                    </tr>

                   
                 </thead>

                 <tbody>
                    {filterdUsers.map((user)=> (
                        <tr key= {user.id} className="border-t hover:bg-gray-50">
                            <td className="p-3">
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-gray-500 text-xs">{user.eamil}</p>
                                </div>
                            </td>
                            <td className="p-3">{user.type}</td>
                             <td className="p-3">{user.region}</td>
                             <td className="p-3">{user.date}</td>
                             <td className="p-3">
                               <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                                 {user.status}
                               </span>
                             </td>
                          
                          <td className="p-3">
                              <button className="text-blue-500 hover:text-blue-700">
                                  <FaEdit />
                             </button>
                          </td>
                        

                        </tr>
                    ))}
                 </tbody>
            </table>
        </div>
    )
}