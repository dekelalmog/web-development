// src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { getUserById } from '../../services/user-service';
import { User } from '../../services/interfaces';
import Toolbar from '../Toolbar/Toolbar';
import './Profile.css';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    // For testing: Set up localStorage with a test user ID
    if (process.env.NODE_ENV === 'development' && !localStorage.getItem('userId')) {
      localStorage.setItem('userId', 'test-user-id');
    }

    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        if (process.env.NODE_ENV === 'development' && userId === 'test-user-id') {
          // Mock user data for testing
          setUser({
            _id: 'test-user-id',
            name: 'Test User',
            email: 'test@example.com',
            imageUrl: 'https://via.placeholder.com/150',
            tokens: [],
          });
        } else {
          const userData = await getUserById(userId);
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleChangePicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      try {
        // Implement file upload logic here
        // For now, we'll just update the user with a new URL
        const imageUrl = URL.createObjectURL(file);
        const updatedUser = await updateUser(user._id, { ...user, imageUrl });
        setUser(updatedUser);
      } catch (error) {
        console.error('Error updating profile picture:', error);
      }
    }
  };

  const handleChangeUsername = async () => {
    if (user && newUsername) {
      try {
        const updatedUser = await updateUser(user._id, { ...user, name: newUsername });
        setUser(updatedUser);
        setIsEditing(false);
        setNewUsername('');
      } catch (error) {
        console.error('Error updating username:', error);
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <Toolbar />
      <div className="profile-content">
        <h1>Hello, {user.name}!</h1>
        <div className="profile-picture">
          <img src={user.imageUrl || '/default-avatar.png'} alt={user.name} />
          <input
            type="file"
            id="profile-picture-input"
            accept="image/*"
            onChange={handleChangePicture}
            style={{ display: 'none' }}
          />
          <label htmlFor="profile-picture-input" className="profile-button">
            Change Picture
          </label>
        </div>
        {isEditing ? (
          <div>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="New username"
            />
            <button onClick={handleChangeUsername} className="profile-button">
              Save Username
            </button>
            <button onClick={() => setIsEditing(false)} className="profile-button">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="profile-button">
            Change Username
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;