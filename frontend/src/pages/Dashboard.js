import React, { useState, useEffect } from 'react';
import { userAPI, gamificationAPI, resourceAPI } from '../utils/api';
import { useAuthStore } from '../context/store';
import toast from 'react-hot-toast';
import { FaBook, FaDownload, FaAward, FaStar, FaTrophy, FaFire } from 'react-icons/fa';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const [dashboardRes, gamificationRes] = await Promise.all([
        userAPI.getDashboard(),
        gamificationAPI.getStats(),
      ]);

      setStats(dashboardRes.data.stats || {});
      setRecommendations(dashboardRes.data.recommendations || []);
    } catch (error) {
      console.log('Dashboard data not yet available');
      setStats({
        totalResourcesUploaded: 0,
        totalDownloads: 0,
        communityReputation: 0,
        experiencePoints: 0,
      });
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="loading-skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>👋 Welcome back, {user?.firstName}!</h1>
          <p>Here's what's happening with your teaching journey today.</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <FaBook className="stat-icon" />
            <div className="stat-content">
              <h3 className="stat-value">{stats?.totalResourcesUploaded || 0}</h3>
              <p className="stat-label">Resources Uploaded</p>
            </div>
          </div>
          <div className="stat-card">
            <FaDownload className="stat-icon" />
            <div className="stat-content">
              <h3 className="stat-value">{stats?.totalDownloads || 0}</h3>
              <p className="stat-label">Downloads Received</p>
            </div>
          </div>
          <div className="stat-card">
            <FaTrophy className="stat-icon" />
            <div className="stat-content">
              <h3 className="stat-value">{stats?.communityReputation || 0}</h3>
              <p className="stat-label">Community Reputation</p>
            </div>
          </div>
          <div className="stat-card">
            <FaFire className="stat-icon" />
            <div className="stat-content">
              <h3 className="stat-value">{stats?.experiencePoints || 0}</h3>
              <p className="stat-label">Experience Points</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="dashboard-grid">
          {/* Recommendations */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>📚 Recommended Resources</h2>
              <a href="/resources">View All →</a>
            </div>
            {recommendations.length > 0 ? (
              <div className="recommendations-list">
                {recommendations.map((resource) => (
                  <div key={resource._id} className="resource-preview">
                    <div className="resource-preview-header">
                      <h3>{resource.title}</h3>
                    </div>
                    <div className="resource-preview-body">
                      <div className="resource-meta">
                        <span className="resource-badge">{resource.subject}</span>
                        <span className="resource-badge">{resource.gradeLevel}</span>
                      </div>
                      <div className="resource-stats">
                        <span>⭐ {resource.rating?.averageRating?.toFixed(1) || '0.0'}</span>
                        <span>⬇️ {resource.downloads || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📚</div>
                <p>No recommendations yet. Start uploading resources!</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>⚡ Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <button className="action-btn">
                <div className="action-btn-icon">📤</div>
                <h4>Upload Resource</h4>
                <p>Share your materials</p>
              </button>
              <button className="action-btn">
                <div className="action-btn-icon">📝</div>
                <h4>Create Lesson</h4>
                <p>Plan with AI</p>
              </button>
              <button className="action-btn">
                <div className="action-btn-icon">👥</div>
                <h4>Join Community</h4>
                <p>Connect with peers</p>
              </button>
              <button className="action-btn">
                <div className="action-btn-icon">🎓</div>
                <h4>Earn Badges</h4>
                <p>Complete challenges</p>
              </button>
            </div>
          </div>
        </div>

        {/* Gamification Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>🏆 Your Progress</h2>
          </div>
          <div className="progress-cards">
            <div className="progress-card">
              <h3>Current Level</h3>
              <div className="level-display">
                <span className="level-number">1</span>
              </div>
              <p>10/100 XP to next level</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '10%' }}></div>
              </div>
            </div>
            <div className="progress-card">
              <h3>Badges Earned</h3>
              <div className="badges-display">
                <span className="badge">🎖️</span>
                <span className="badge">⭐</span>
                <span className="badge-locked">🔒</span>
              </div>
              <p>3 of 10 badges unlocked</p>
            </div>
            <div className="progress-card">
              <h3>Weekly Streak</h3>
              <div className="streak-display">
                <span className="streak-number">0</span>
                <span className="streak-label">days</span>
              </div>
              <p>Get active to build your streak!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
