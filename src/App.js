import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout bileşenleri
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Sayfa bileşenleri
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Videos from './pages/Videos';
import Blogs from './pages/Blogs';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-background-light">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background-light p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/blog" element={<Blogs />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
