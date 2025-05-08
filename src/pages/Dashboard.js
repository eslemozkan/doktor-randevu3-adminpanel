import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, 
  faChartLine,
  faArrowRight,
  faUser,
  faClock,
  faCheck,
  faTimes,
  faCalendarMinus,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [isUnavailableModalOpen, setIsUnavailableModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [stats, setStats] = useState({
    todaysAppointments: 0,
    uniquePatients: 0,
    monthlyAppointments: 0,
  });

  const navigate = useNavigate();

  // İstatistikleri dinamik hesapla
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

  const todaysAppointments = appointments.filter(a => a.date === today).length;
  const uniquePatients = new Set(appointments.map(a => a.full_name)).size;
  const monthlyAppointments = appointments.filter(a => (a.date || '').slice(0, 7) === currentMonth).length;

  useEffect(() => {
    if (appointments.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const currentMonth = new Date().toISOString().slice(0, 7);

      const todaysAppointments = appointments.filter(a => a.date === today).length;
      const uniquePatients = new Set(appointments.map(a => a.full_name)).size;
      const monthlyAppointments = appointments.filter(a => (a.date || '').slice(0, 7) === currentMonth).length;

      setStats({
        todaysAppointments,
        uniquePatients,
        monthlyAppointments,
      });
    }
  }, [appointments]);

  const statistics = [
    { 
      title: 'Bugünkü Randevular', 
      value: stats.todaysAppointments, 
      icon: faCalendarCheck,
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      title: 'Toplam Hasta', 
      value: stats.uniquePatients, 
      icon: faUser,
      color: 'bg-green-100 text-green-600'
    },
    { 
      title: 'Aylık Randevu', 
      value: stats.monthlyAppointments, 
      icon: faChartLine,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const hours = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  // Unavailable saatleri Supabase'den çek
  const fetchUnavailableSlots = async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('unavailable_times')
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (!error) {
      const filteredSlots = data.filter(slot => slot.date >= today);
      setUnavailableSlots(filteredSlots);
    }
    setLoading(false);
  };

  const deletePastUnavailableSlots = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase
      .from('unavailable_times')
      .delete()
      .lt('date', today);

    if (error) {
      console.error('Geçmiş müsait olmayan saatler silinirken hata oluştu:', error);
    }
  };

  useEffect(() => {
    fetchUnavailableSlots();
    deletePastUnavailableSlots();
  }, []);

  const handleAddUnavailableSlot = async () => {
    if (selectedDate && startTime && endTime) {
      const today = new Date().toISOString().split('T')[0];
      if (selectedDate < today) {
        alert('Geçmiş bir tarihe müsait olmayan saat ekleyemezsiniz.');
        return;
      }
      setLoading(true);
      const { error } = await supabase.from('unavailable_times').insert([
        {
          date: selectedDate,
          start_time: startTime,
          end_time: endTime,
        },
      ]);
      setLoading(false);
      if (!error) {
        setSelectedDate('');
        setStartTime('');
        setEndTime('');
        setIsUnavailableModalOpen(false);
        fetchUnavailableSlots();
      } else {
        alert('Kayıt başarısız: ' + error.message);
      }
    }
  };

  const handleDeleteSlot = async (id) => {
    setLoading(true);
    await supabase.from('unavailable_times').delete().eq('id', id);
    setLoading(false);
    fetchUnavailableSlots();
  };

  // Randevuları getir
  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Randevular getirilirken hata oluştu:', error);
    } else {
      console.log('Gelen randevu verileri:', data);
      console.log('Toplam randevu sayısı:', data.length);
    }

    setAppointments(data || []);
    setLoadingAppointments(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Son randevular için kesin sıralama (önce created_at, yoksa date+time)
  const sortedAppointments = [...appointments].sort((a, b) => {
    if (a.created_at && b.created_at) {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    const fixTime = t => t && t.length === 5 ? t + ':00' : (t || '00:00:00');
    const dateA = new Date(`${a.date}T${fixTime(a.time)}`);
    const dateB = new Date(`${b.date}T${fixTime(b.time)}`);
    return dateB - dateA;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-primary-dark">Dashboard</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statistics.map((stat, index) => (
              <div key={index} className="bg-background-light rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-primary-dark mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                    <FontAwesomeIcon icon={stat.icon} className="w-6 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-background-light rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-primary-dark">Müsait Olunmayan Saatler</h2>
              <button 
                onClick={() => setIsUnavailableModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded-full font-semibold hover:bg-primary-light transition-colors shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <FontAwesomeIcon icon={faCalendarMinus} className="w-4 h-4" />
                <span>Müsait Olunmayan Saat Ekle</span>
              </button>
            </div>

            {unavailableSlots.length === 0 ? (
              <div className="text-gray-500">Kayıtlı müsait olunmayan saat yok.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unavailableSlots.map((slot) => (
                  <div key={slot.id} className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-primary-dark">{slot.date}</h3>
                          <p className="text-sm text-gray-500">{slot.start_time} - {slot.end_time}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="p-2 text-red-500 hover:text-red-600 transition-colors"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-background-light rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-primary-dark">Son Randevular</h2>
              <button className="text-primary hover:text-primary-light flex items-center space-x-2" onClick={() => navigate('/appointments')}>
                <span>Tümünü Gör</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {loadingAppointments ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : appointments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Henüz randevu bulunmuyor.</p>
              ) : (
                sortedAppointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                          <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-primary-dark">
                            {appointment.full_name}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                            <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {appointment.status === 'pending' && (
                          <>
                            <button className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors">
                              <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors">
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
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Müsait Olunmayan Saat Ekleme Modalı */}
      {isUnavailableModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-primary-dark mb-4">Müsait Olunmayan Saat Ekle</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Saati</label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Başlangıç Saati</option>
                    {hours.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Saati</label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Bitiş Saati</option>
                    {hours.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsUnavailableModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  İptal
                </button>
                <button
                  onClick={handleAddUnavailableSlot}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Ekleniyor...' : 'Ekle'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 