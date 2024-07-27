// src/components/Toolbar.tsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/user-service";
import "./Toolbar.css";
import { getWeather } from "../../services/weather-service";

const Toolbar: React.FC = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = React.useState<number>();

  useEffect(() => {
    getWeather().then((weather) => {
      const currentHour = new Date().getHours();
      setWeather(weather.temperature[currentHour]);
    });
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
    }
  }, [navigate]);

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
      <div className="weather">{weather?.toFixed(1)}°C</div>
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
