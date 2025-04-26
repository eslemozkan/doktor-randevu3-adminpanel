import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faVideo, 
  faBlog, 
  faCalendar, 
  faUserMd, 
  faBars, 
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';

function AdminPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState('dashboard');

  const menuItems = [
    { icon: faHome, name: 'Dashboard', key: 'dashboard' },
    { icon: faVideo, name: 'Video Yönetimi', key: 'videos' },
    { icon: faBlog, name: 'Blog Yönetimi', key: 'blog' },
    { icon: faCalendar, name: 'Randevu Yönetimi', key: 'appointments' },
    { icon: faUserMd, name: 'Hasta Dosyaları', key: 'patients' }
  ];

  return (
    <div className="flex h-screen bg-[#F5F7FA]">
      {/* Sidebar */}
      <div className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        bg-[#394C8C] text-white transition-all duration-300 ease-in-out
      `}>
        <div className="flex items-center justify-between p-4 border-b border-[#5A70B9]">
          <h1 className={`
            font-bold text-xl transition-opacity 
            ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}
          `}>
            Admin Panel
          </h1>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="focus:outline-none"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveModule(item.key)}
              className={`
                w-full flex items-center p-4 hover:bg-[#5A70B9] 
                ${activeModule === item.key ? 'bg-[#5A70B9]' : ''}
                transition-colors duration-200
              `}
            >
              <FontAwesomeIcon icon={item.icon} className="mr-4" />
              <span className={`
                transition-opacity 
                ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}
              `}>
                {item.name}
              </span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full">
          <button 
            className="w-full flex items-center p-4 hover:bg-red-600 
                       transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-4" />
            <span className={`
              transition-opacity 
              ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}
            `}>
              Çıkış Yap
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Üst Navigasyon */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#1E2E62]">
            {menuItems.find(item => item.key === activeModule)?.name}
          </h2>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="bg-[#394C8C] text-white rounded-full px-2 py-1 text-xs absolute -top-2 -right-2">
                3
              </span>
              <button className="text-[#384C8C] hover:text-[#5A70B9]">
                Bildirimler
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <img 
                src="https://via.placeholder.com/40" 
                alt="Profil" 
                className="rounded-full w-10 h-10"
              />
              <span className="text-[#1E2E62]">Admin</span>
            </div>
          </div>
        </header>

        {/* İçerik Alanı */}
        <main className="p-6">
          {/* Aktif modüle göre içerik değişecek */}
          {activeModule === 'dashboard' && (
            <div>Dashboard İçeriği</div>
          )}
          {activeModule === 'videos' && (
            <div>Video Yönetimi İçeriği</div>
          )}
          {/* Diğer modüller için benzer bloklar */}
        </main>
      </div>
    </div>
  );
}

export default AdminPanel;