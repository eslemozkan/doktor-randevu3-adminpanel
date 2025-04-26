import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faTimes,
  faUser,
  faPhone,
  faEnvelope,
  faCalendarAlt,
  faClock,
  faNotesMedical,
  faFileUpload
} from '@fortawesome/free-solid-svg-icons';

const Appointments = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: {
        fullName: 'Ahmet Yılmaz',
        phoneNumber: '5551234567',
        email: 'ahmet.yilmaz@example.com',
      },
      date: '15 Mart 2024',
      time: '14:30',
      status: 'Beklemede',
      complaint: 'Diyabet kontrolü için geliyorum. Son tahlil sonuçlarımı da getireceğim.',
      medicalFile: 'tahlil_sonuclari.pdf'
    },
    {
      id: 2,
      patient: {
        fullName: 'Ayşe Demir',
        phoneNumber: '5552345678',
        email: 'ayse.demir@example.com',
      },
      date: '15 Mart 2024',
      time: '15:00',
      status: 'Beklemede',
      complaint: 'Tiroid şikayetim var. Son zamanlarda çok yorgun hissediyorum.',
      medicalFile: 'tiroid_tahlilleri.pdf'
    },
    {
      id: 3,
      patient: {
        fullName: 'Mehmet Kaya',
        phoneNumber: '5553456789',
        email: 'mehmet.kaya@example.com',
      },
      date: '16 Mart 2024',
      time: '10:00',
      status: 'Onaylandı',
      complaint: 'Diyabet ilaçlarımı yenilemek için geliyorum.',
      medicalFile: 'son_tahliller.pdf'
    }
  ]);

  const handleStatusChange = (id, newStatus) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status: newStatus } : appointment
    ));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary-dark">Randevular</h1>
            <button className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-light transition-colors shadow-lg hover:shadow-xl">
              Yeni Randevu
            </button>
          </div>

          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="bg-background-light rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-dark">{appointment.patient.fullName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center">
                          <FontAwesomeIcon icon={faPhone} className="w-4 h-4 mr-2" />
                          {appointment.patient.phoneNumber}
                        </span>
                        <span className="flex items-center">
                          <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 mr-2" />
                          {appointment.patient.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {appointment.status === 'Beklemede' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'Onaylandı')}
                          className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                          title="Randevuyu Onayla"
                        >
                          <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'İptal Edildi')}
                          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                          title="Randevuyu İptal Et"
                        >
                          <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      appointment.status === 'Onaylandı' ? 'bg-green-100 text-green-600' :
                      appointment.status === 'İptal Edildi' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4" />
                      <span>Randevu Tarihi: {appointment.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                      <span>Randevu Saati: {appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <FontAwesomeIcon icon={faFileUpload} className="w-4 h-4" />
                      <span>Yüklenen Dosya: </span>
                      <a 
                        href={`#${appointment.medicalFile}`} 
                        className="text-primary hover:text-primary-light"
                      >
                        {appointment.medicalFile}
                      </a>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                      <FontAwesomeIcon icon={faNotesMedical} className="w-4 h-4" />
                      <span>Şikayet Açıklaması</span>
                    </div>
                    <p className="text-sm text-primary-dark bg-white p-3 rounded-lg">
                      {appointment.complaint}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments; 