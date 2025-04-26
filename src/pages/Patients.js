import React from 'react';

const Patients = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Hastalar</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light">
          Yeni Hasta Ekle
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm">
        {/* Hasta listesi buraya gelecek */}
      </div>
    </div>
  );
};

export default Patients; 