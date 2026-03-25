import React, { useState, useEffect } from 'react';
import { userAPI } from '../utils/api';
import '../styles/profile.css';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data.user);
    } catch (error) {
      console.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img src={profile?.profilePicture?.url} alt={profile?.firstName} className="profile-avatar" />
        <div className="profile-info">
          <h1>{profile?.firstName} {profile?.lastName}</h1>
          <p className="bio">{profile?.biography}</p>
          <span className="level">Level {profile?.level}</span>
        </div>
      </div>

      <div className="container">
        <div className="profile-stats">
          <div className="stat">
            <h3>{profile?.totalResourcesUploaded}</h3>
            <p>Resources</p>
          </div>
          <div className="stat">
            <h3>{profile?.experiencePoints}</h3>
            <p>XP</p>
          </div>
          <div className="stat">
            <h3>{profile?.achievementBadges?.length}</h3>
            <p>Badges</p>
          </div>
        </div>

        <div className="profile-tabs">
          <div className="tab-content">
            <h2>Resources</h2>
            {/* List resources */}
          </div>
          <div className="tab-content">
            <h2>Badges</h2>
            <div className="badges-grid">
              {profile?.achievementBadges?.map((badge) => (
                <div key={badge.badgeId} className="badge-item">
                  <div className="badge-icon">{badge.icon}</div>
                  <h4>{badge.badgeName}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
