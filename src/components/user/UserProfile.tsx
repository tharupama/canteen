import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import './UserProfile.css';

interface UserProfileProps {
  onShowHistory: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onShowHistory }) => {
  const { currentUser } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {currentUser.displayName?.charAt(0).toUpperCase() || currentUser.email?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-details">
            <h3>{currentUser.displayName || 'User'}</h3>
            <p>{currentUser.email}</p>
            {currentUser.photoURL && <p className="phone">📱 {currentUser.photoURL}</p>}
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button 
          onClick={onShowHistory}
          className="history-btn"
        >
          View Order History
        </button>
        <button 
          onClick={handleSignOut}
          className="signout-btn"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;