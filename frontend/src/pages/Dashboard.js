import React, { useState, useEffect } from 'react';
import { userAPI, gamificationAPI, resourceAPI } from '../utils/api';
import { useAuthStore } from '../context/store';
import toast from 'react-hot-toast';
import { FaBook, FaDownload, FaAward, FaStar } from 'react-icons/fa';
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

      setStats(dashboardRes.data.stats);
      setRecommendations(dashboardRes.data.recommendations);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="loading">Loading your dashboard...</div>;

  return (
    <div className="dashboard">
      <div className="container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>👋 {user?.greeting || `Welcome back, ${user?.firstName}!`}</h1>
          <p>Here's what's happening with your account today.</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <FaBook className="stat-icon" />
            <div>
              <h3>{stats?.totalResourcesUploaded || 0}</h3>
              <p>Resources Uploaded</p>
            </div>
          </div>
          <div className="stat-card">
            <FaDownload className="stat-icon" />
            <div>
              <h3>{stats?.totalDownloads || 0}</h3>
              <p>Downloads Received</p>
            </div>
          </div>
          <div className="stat-card">
            <FaStar className="stat-icon" />
            <div>
              <h3>{stats?.communityReputation || 0}</h3>
              <p>Community Reputation</p>
            </div>
          </div>
          <div className="stat-card">
            <FaAward className="stat-icon" />
            <div>
              <h3>{stats?.experiencePoints || 0}</h3>
              <p>Experience Points</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-grid">
          {/* Recommendations */}
          <div className="dashboard-section">
            <h2>📚 Recommended Resources</h2>
            <div className="resources-list">
              {recommendations?.map((resource) => (
                <div key={resource._id} className="resource-item">
                  <div>
                    <h4>{resource.title}</h4>
                    <p>{resource.subject} • Grade {resource.gradeLevels?.[0]}</p>
                  </div>
                  <span className="download-count">{resource.downloads} Downloads</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <h2>⚡ Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-btn">
                <span>📤</span>
                <h4>Upload Resource</h4>
                <p>Share your materials</p>
              </button>
              <button className="action-btn">
                <span>📝</span>
                <h4>Create Lesson Plan</h4>
                <p>Build with AI assistance</p>
              </button>
              <button className="action-btn">
                <span>👥</span>
                <h4>Join Community</h4>
                <p>Connect with peers</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
