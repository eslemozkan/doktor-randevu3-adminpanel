import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faCalendarCheck, 
  faVideo,
  faBlog
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: faHome, label: 'Dashboard' },
    { path: '/appointments', icon: faCalendarCheck, label: 'Randevular' },
    { path: '/videos', icon: faVideo, label: 'Videolar' },
    { path: '/blog', icon: faBlog, label: 'Blog Yazıları' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">Prof. Dr. Yusuf Özkan</p>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-4 text-gray-600 hover:bg-background-light transition-colors duration-300 ${
              location.pathname === item.path ? 'bg-background-light text-primary border-r-4 border-primary' : ''
            }`}
          >
            <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 