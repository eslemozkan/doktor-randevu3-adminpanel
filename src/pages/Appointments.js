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
  const [removedIds, setRemovedIds] = useState([]);
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
        .order('created_at', { ascending: false });

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
      // Randevuyu güncelle
      const { data: appointment, error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Mail gönderme işlemi
      console.log('appointment:', appointment);
      const email = appointment.email || appointment.patients?.email || appointment.user?.email || null;
      console.log('Mail gönderilecek veri:', {
        email,
        status: newStatus,
        full_name: appointment.full_name,
        date: appointment.date,
        time: appointment.time
      });
      const mailResponse = await fetch('http://localhost:3000/api/send-appointment-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          status: newStatus,
          full_name: appointment.full_name,
          date: appointment.date,
          time: appointment.time
        }),
      });

      if (!mailResponse.ok) {
        const err = await mailResponse.json();
        console.error('Mail gönderilirken hata oluştu:', err.error);
      }

      setAppointments(appointments.map(appointment => 
        appointment.id === id ? { ...appointment, status: newStatus } : appointment
      ));

      alert(`Randevu ${newStatus === 'confirmed' ? 'onaylandı' : 'reddedildi'} ve hasta bilgilendirildi.`);
    } catch (error) {
      console.error('Error updating appointment status:', error.message);
      alert('Randevu durumu güncellenirken bir hata oluştu: ' + error.message);
    }
  };

  const handleViewLabResults = (appointment) => {
    setSelectedAppointment(appointment);
    setIsLabResultsOpen(true);
  };

  const isPast = (date, time) => {
    if (!date || !time) return false;
    const now = new Date();
    const dt = new Date(`${date}T${time}`);
    return dt < now;
  };

  const visibleAppointments = appointments.filter(
    (a) =>
      !removedIds.includes(a.id) &&
      a.status !== 'cancelled' &&
      !isPast(a.date, a.time)
  );

  useEffect(() => {
    const toRemove = appointments.filter(
      (a) => a.status === 'cancelled' || isPast(a.date, a.time)
    ).map(a => a.id);
    if (toRemove.length > 0) {
      toRemove.forEach((id, i) => {
        setTimeout(() => setRemovedIds(r => [...r, id]), i * 100);
      });
    }
  }, [appointments]);

  // En yeni randevular en başta olacak şekilde sıralama (önce created_at, yoksa date+time)
  const sortedAppointments = [...visibleAppointments].sort((a, b) => {
    if (a.created_at && b.created_at) {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    const fixTime = t => t && t.length === 5 ? t + ':00' : (t || '00:00:00');
    const dateA = new Date(`${a.date}T${fixTime(a.time)}`);
    const dateB = new Date(`${b.date}T${fixTime(b.time)}`);
    return dateB - dateA;
  });
  console.log('sortedAppointments:', sortedAppointments.slice(0, 5));

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

          {/* Randevu Listesi */}
          <div className="space-y-4">
            {sortedAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className={`bg-background-light rounded-xl p-4 hover:shadow-md transition-shadow duration-500 ease-in-out ${removedIds.includes(appointment.id) ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-dark">
                        {appointment.full_name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center">
                          <FontAwesomeIcon icon={faPhone} className="w-4 h-4 mr-2" />
                          {appointment.phone_number}
                        </span>
                        {appointment.email && (
                          <span className="flex items-center">
                            <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 mr-2" />
                            {appointment.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {['pending', 'Beklemede'].includes(appointment.status) && (
                      <>
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                          className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                          title="Randevuyu Onayla"
                        >
                          <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                          title="Randevuyu Reddet"
                        >
                          <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      ['confirmed', 'Onaylandı'].includes(appointment.status) ? 'bg-green-100 text-green-600' :
                      ['cancelled', 'İptal Edildi'].includes(appointment.status) ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {['confirmed', 'Onaylandı'].includes(appointment.status) ? 'Onaylandı' :
                       ['cancelled', 'İptal Edildi'].includes(appointment.status) ? 'İptal Edildi' :
                       'Beklemede'}
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
                      <span>Tahlil Sonucu: </span>
                      <a 
                        href={appointment.medical_file_url} 
                        className="text-primary hover:text-primary-light underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Görüntüle
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
                      <span>Tahlil Özetini Gör</span>
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