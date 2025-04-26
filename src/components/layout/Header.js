import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-primary-dark">Hoş Geldiniz</h2>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-background-light px-4 py-2 rounded-full">
            <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-primary" />
            <span className="text-primary-dark font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 