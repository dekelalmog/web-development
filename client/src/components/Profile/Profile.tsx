// src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { getUserById, updateUser } from '../../services/user-service';
import { uploadFile } from '../../services/file-service';
import { User } from '../../services/interfaces';
import Toolbar from '../Toolbar/Toolbar';
import './Profile.css';
import { imageFullPath } from '../../services/utils';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {

    localStorage.setItem('userId', '66a3bbc8fc93902ae0587136');
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');

      if (userId) {
          const userData = await getUserById(userId);
          setUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleChangePicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      try {
        const imageUrl = await uploadFile(file)
        const updatedUser = await updateUser(user._id, user.name, imageFullPath(imageUrl));
        setUser(updatedUser);
      } catch (error) {
        console.error('Error updating profile picture:', error);
      }
    }
  };

  const handleChangeUsername = async () => {
    if (user && newUsername) {
      try {
        const updatedUser = await updateUser(user._id, newUsername, user.imageUrl );
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
          <img src={user.imageUrl || '/src/assets/default-avatar.jpg'} alt={user.name} />
        </div>
        <div className="profile-actions">
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
          {isEditing ? (
            <div className="edit-username">
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
    </div>
  );
};

export default Profile;