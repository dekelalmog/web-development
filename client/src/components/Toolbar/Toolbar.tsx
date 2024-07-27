// src/components/Toolbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Toolbar.css";

const Toolbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout logic here
    // For example: clear local storage, remove auth token, etc.
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="toolbar">
      <div className="weather">24C</div>
      <Link to="/home" className="app-name">
        TravelerApp
      </Link>
      <div className="toolbar-actions">
        <Link to="/profile" className="profile-icon">
          <i className="fa fa-user" title="profile page" aria-hidden="true"></i>
        </Link>
        <button onClick={handleLogout} title="Logout" className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Toolbar;
