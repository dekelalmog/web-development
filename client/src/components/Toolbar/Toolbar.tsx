// src/components/Toolbar.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/user-service";
import "./Toolbar.css";

const Toolbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out, please try again later");
    }
  };

  return (
    <nav className="toolbar">
      <div className="weather">24C</div>
      <Link to="/" className="app-name">
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
