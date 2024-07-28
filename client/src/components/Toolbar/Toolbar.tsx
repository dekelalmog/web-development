import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserById, logout } from "../../services/user-service";
import { getWeather } from "../../services/weather-service";
import "./Toolbar.css";
import { refreshToken } from "../../services/api-service";

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
    (async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        await getUserById(userId);
      } catch (error) {
        try {
          await refreshToken();
        } catch (error) {
          localStorage.removeItem("userId");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/login");
        }
      }
    })();
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
