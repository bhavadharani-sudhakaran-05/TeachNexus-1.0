import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userAPI } from '../utils/api';
import '../styles/profile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    biography: '',
    schoolName: '',
    subjectSpecializations: '',
    gradeLevels: '',
  });

  const loggedInUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }, []);

  const isOwnProfile = !userId || (loggedInUser?._id && loggedInUser._id === userId);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const response = isOwnProfile ? await userAPI.getProfile() : await userAPI.getPublicProfile(userId);
      const userProfile = response.data.user;
      setProfile(userProfile);
      setFormValues({
        firstName: userProfile?.firstName || '',
        lastName: userProfile?.lastName || '',
        biography: userProfile?.biography || '',
        schoolName: userProfile?.schoolName || '',
        subjectSpecializations: (userProfile?.subjectSpecializations || []).join(', '),
        gradeLevels: (userProfile?.gradeLevels || []).join(', '),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const onFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const parseCsv = (value) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const saveProfile = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const response = await userAPI.updateProfile({
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        biography: formValues.biography,
        schoolName: formValues.schoolName,
        subjectSpecializations: parseCsv(formValues.subjectSpecializations),
        gradeLevels: parseCsv(formValues.gradeLevels),
      });
      setProfile(response.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const initials = `${profile?.firstName?.[0] || ''}${profile?.lastName?.[0] || ''}`.toUpperCase() || 'U';

  const renderOverviewTab = () => (
    <div className="tab-content-card">
      <h3 className="section-title">Professional Snapshot</h3>
      <div className="profile-meta-grid">
        <div className="meta-item">
          <span>School</span>
          <strong>{profile?.schoolName || 'Not provided'}</strong>
        </div>
        <div className="meta-item">
          <span>Specializations</span>
          <strong>{profile?.subjectSpecializations?.join(', ') || 'Not provided'}</strong>
        </div>
        <div className="meta-item">
          <span>Grade Levels</span>
          <strong>{profile?.gradeLevels?.join(', ') || 'Not provided'}</strong>
        </div>
        <div className="meta-item">
          <span>Community Reputation</span>
          <strong>{profile?.communityReputation || 0}</strong>
        </div>
      </div>
    </div>
  );

  const renderResourcesTab = () => {
    const resources = profile?.uploadedResources || [];

    return (
      <div className="tab-content-card">
        <h3 className="section-title">Published Resources</h3>
        {resources.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📁</div>
            <p>No resources uploaded yet.</p>
          </div>
        ) : (
          <div className="resources-section">
            {resources.map((resource) => (
              <div key={resource._id} className="resource-item">
                <h4 className="resource-item-title">{resource.title}</h4>
                <div className="resource-item-meta">
                  <span>{resource.subject || 'General'}</span>
                  <span>⭐ {resource.rating || 0}</span>
                </div>
                <div className="resource-item-footer">
                  <span>Downloads: {resource.downloads || 0}</span>
                  <span>Views: {resource.views || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderBadgesTab = () => {
    const badges = profile?.achievementBadges || [];

    return (
      <div className="tab-content-card">
        <h3 className="section-title">Achievements</h3>
        {badges.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏅</div>
            <p>No badges yet. Keep teaching and contributing.</p>
          </div>
        ) : (
          <div className="badges-grid">
            {badges.map((badge, index) => (
              <div key={`${badge.badgeId}-${index}`} className="badge-card">
                <div className="badge-icon">🏅</div>
                <h4 className="badge-title">{badge.badgeId || 'Achievement Badge'}</h4>
                <p className="badge-date">
                  {badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString() : 'Unlocked'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-cover" />
          <div className="profile-info">
            {profile?.profilePicture?.url ? (
              <img src={profile.profilePicture.url} alt={profile?.firstName} className="profile-avatar" />
            ) : (
              <div className="profile-avatar">{initials}</div>
            )}

            <h1 className="profile-name">{profile?.firstName} {profile?.lastName}</h1>
            <p className="profile-title">{profile?.userType || 'teacher'}</p>
            <p className="profile-bio">{profile?.biography || 'Add your teaching bio to build your profile.'}</p>

            <span className="level-badge">Level {profile?.level || 1}</span>

            {isOwnProfile && !isEditing && (
              <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-box">
            <p className="stat-number">{profile?.totalResourcesUploaded || 0}</p>
            <p className="stat-label">Resources</p>
          </div>
          <div className="stat-box">
            <p className="stat-number">{profile?.experiencePoints || 0}</p>
            <p className="stat-label">XP</p>
          </div>
          <div className="stat-box">
            <p className="stat-number">{profile?.achievementBadges?.length || 0}</p>
            <p className="stat-label">Badges</p>
          </div>
          <div className="stat-box">
            <p className="stat-number">{profile?.totalDownloads || 0}</p>
            <p className="stat-label">Downloads</p>
          </div>
        </div>

        {isOwnProfile && isEditing && (
          <form className="tab-content-card profile-edit-form" onSubmit={saveProfile}>
            <h3 className="section-title">Edit Profile</h3>

            <div className="edit-grid">
              <label>
                First Name
                <input name="firstName" value={formValues.firstName} onChange={onFormChange} required />
              </label>
              <label>
                Last Name
                <input name="lastName" value={formValues.lastName} onChange={onFormChange} required />
              </label>
              <label>
                School
                <input name="schoolName" value={formValues.schoolName} onChange={onFormChange} />
              </label>
              <label>
                Subjects (comma-separated)
                <input
                  name="subjectSpecializations"
                  value={formValues.subjectSpecializations}
                  onChange={onFormChange}
                />
              </label>
              <label>
                Grade Levels (comma-separated)
                <input name="gradeLevels" value={formValues.gradeLevels} onChange={onFormChange} />
              </label>
            </div>

            <label>
              Biography
              <textarea name="biography" value={formValues.biography} onChange={onFormChange} rows={4} />
            </label>

            <div className="edit-actions">
              <button type="button" className="tab-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="edit-profile-btn" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
          <button
            className={`tab-btn ${activeTab === 'badges' ? 'active' : ''}`}
            onClick={() => setActiveTab('badges')}
          >
            Badges
          </button>
        </div>

        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'resources' && renderResourcesTab()}
        {activeTab === 'badges' && renderBadgesTab()}
      </div>
    </div>
  );
};

export default UserProfile;
