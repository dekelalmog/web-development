// src/components/Toolbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/user-service';
import './Toolbar.css';

const Toolbar: React.FC = () => {
  const navigate = useNavigate();
  const [temperature, setTemperature] = useState('');

  useEffect(() => {
    // Fetch temperature from backend (to be implemented)
    // For now, we'll use a placeholder
    setTemperature('24°C');
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="toolbar">
      <div className="toolbar-left">
        <span className="temperature">{temperature}</span>
      </div>
      <Link to="/home" className="app-name">TravelerApp</Link>
      <div className="toolbar-right">
        <Link to="/profile" className="profile-icon">
          <i className="fas fa-user"></i>
        </Link>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </nav>
  );
};

export default Toolbar;