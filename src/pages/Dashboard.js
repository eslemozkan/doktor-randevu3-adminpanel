import React, { useState } from 'react';
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

const Dashboard = () => {
  const [isUnavailableModalOpen, setIsUnavailableModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [unavailableSlots, setUnavailableSlots] = useState([
    { id: 1, date: '15 Mart 2024', time: '12:00', reason: 'Öğle Arası' },
    { id: 2, date: '15 Mart 2024', time: '13:00', reason: 'Öğle Arası' },
    { id: 3, date: '16 Mart 2024', time: '17:00', reason: 'Toplantı' }
  ]);

  const statistics = [
    { 
      title: 'Bugünkü Randevular', 
      value: '5', 
      icon: faCalendarCheck,
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      title: 'Toplam Hasta', 
      value: '120', 
      icon: faUser,
      color: 'bg-green-100 text-green-600'
    },
    { 
      title: 'Aylık Randevu', 
      value: '45', 
      icon: faChartLine,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const recentAppointments = [
    { 
      id: 1, 
      name: 'Ahmet Yılmaz', 
      time: '14:30', 
      status: 'Onaylandı',
      statusColor: 'bg-green-100 text-green-600'
    },
    { 
      id: 2, 
      name: 'Ayşe Demir', 
      time: '15:00', 
      status: 'Beklemede',
      statusColor: 'bg-yellow-100 text-yellow-600'
    },
    { 
      id: 3, 
      name: 'Mehmet Kaya', 
      time: '16:30', 
      status: 'İptal Edildi',
      statusColor: 'bg-red-100 text-red-600'
    }
  ];

  const handleAddUnavailableSlot = () => {
    if (selectedDate && selectedTime) {
      const newSlot = {
        id: unavailableSlots.length + 1,
        date: selectedDate,
        time: selectedTime,
        reason: 'Müsait Değil'
      };
      setUnavailableSlots([...unavailableSlots, newSlot]);
      setSelectedDate('');
      setSelectedTime('');
      setIsUnavailableModalOpen(false);
    }
  };

  const handleDeleteSlot = (id) => {
    setUnavailableSlots(unavailableSlots.filter(slot => slot.id !== id));
  };

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
                        <p className="text-sm text-gray-500">{slot.time}</p>
                        <p className="text-xs text-gray-400 mt-1">{slot.reason}</p>
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
          </div>

          <div className="bg-background-light rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-primary-dark">Son Randevular</h2>
              <button className="text-primary hover:text-primary-light flex items-center space-x-2">
                <span>Tümünü Gör</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-primary-dark">{appointment.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                          <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {appointment.status === 'Beklemede' && (
                        <>
                          <button className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors">
                            <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors">
                            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm ${appointment.statusColor}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Saat</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
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
                >
                  Ekle
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