// src/components/Affichage.jsx

import React from 'react';

const Affichage = () => {
  return (
    <div className="p-6  min-h-screen">
     
      {/* Section 2: Indicateurs de qualité par région */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Indicateurs de qualité par région</h2>

        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-600">
            <tr>
              <th scope="col" className="px-4 py-3 text-lg">Région</th>
              <th scope="col" className="px-4 py-3 text-lg">Temps moyen</th>
              <th scope="col" className="px-4 py-3 text-lg">Satisfaction</th>
              <th scope="col" className="px-4 py-3 text-lg">Résolution</th>
              <th scope="col" className="px-4 py-3 text-lg">Score qualité</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-xl">Abidjan</td>
              <td className="px-4 py-3 text-xl">22 min</td>
              <td className="px-4 py-3 text-xl">4.8/5</td>
              <td className="px-4 py-3 text-xl">96%</td>
              <td className="px-4 py-3 text-xl">94.5</td>
            </tr>
            <tr className="border-b hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-xl">Bouaké</td>
              <td className="px-4 py-3 text-xl">25 min</td>
              <td className="px-4 py-3 text-xl">4.6/5</td>
              <td className="px-4 py-3 text-xl">92%</td>
              <td className="px-4 py-3 text-xl">89.2</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Affichage;