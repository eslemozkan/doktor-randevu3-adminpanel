import React, { useState, useEffect } from 'react';
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
  faFileUpload,
  faFlask,
  faVideo
} from '@fortawesome/free-solid-svg-icons';
import LabResultsPopup from '../components/LabResultsPopup';
import { supabase } from '../lib/supabase';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isLabResultsOpen, setIsLabResultsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setAppointments(appointments.map(appointment => 
        appointment.id === id ? { ...appointment, status: newStatus } : appointment
      ));
    } catch (error) {
      console.error('Error updating appointment status:', error.message);
    }
  };

  const handleViewLabResults = (appointment) => {
    setSelectedAppointment(appointment);
    setIsLabResultsOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-primary-dark">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary-dark">Randevular</h1>
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
                    {appointment.videoUrl && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FontAwesomeIcon icon={faVideo} className="w-4 h-4" />
                        <a 
                          href={appointment.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-light"
                        >
                          Video Görüşme Kaydı
                        </a>
                      </div>
                    )}
                    <button
                      onClick={() => handleViewLabResults(appointment)}
                      className="flex items-center space-x-2 text-primary hover:text-primary-light mt-2"
                    >
                      <FontAwesomeIcon icon={faFlask} className="w-4 h-4" />
                      <span>Tahlil Sonuçlarını Gör</span>
                    </button>
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

      <LabResultsPopup
        open={isLabResultsOpen}
        onClose={() => setIsLabResultsOpen(false)}
        labResults={selectedAppointment?.labResults}
      />
    </div>
  );
};

export default Appointments; 