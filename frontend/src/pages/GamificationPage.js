import React, { useState, useEffect } from 'react';
import { gamificationAPI } from '../utils/api';
import toast from 'react-hot-toast';
import '../styles/gamification.css';

const GamificationPage = () => {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    try {
      const [statsRes, leaderboardRes, challengesRes] = await Promise.all([
        gamificationAPI.getStats(),
        gamificationAPI.getLeaderboard(),
        gamificationAPI.getChallenges(),
      ]);

      setStats(statsRes.data.gamification);
      setLeaderboard(leaderboardRes.data.leaderboard);
      setChallenges(challengesRes.data.challenges);
    } catch (error) {
      toast.error('Failed to load gamification data');
    }
  };

  return (
    <div className="gamification-page">
      <div className="container">
        <h1>🏆 Your Achievement Journey</h1>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'badges' ? 'active' : ''}`}
            onClick={() => setActiveTab('badges')}
          >
            Badges
          </button>
          <button
            className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            Leaderboard
          </button>
          <button
            className={`tab ${activeTab === 'challenges' ? 'active' : ''}`}
            onClick={() => setActiveTab('challenges')}
          >
            Challenges
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && stats && (
          <div className="overview-section">
            <div className="stats-overview">
              <div className="stat">
                <h2>{stats.currentLevel}</h2>
                <p>Current Level</p>
              </div>
              <div className="stat">
                <h2>{stats.totalXP}</h2>
                <p>Total XP</p>
              </div>
              <div className="stat">
                <h2>{stats.unlockedBadges?.length || 0}</h2>
                <p>Badges Earned</p>
              </div>
              <div className="stat">
                <h2>{stats.cpdPointsThisYear}</h2>
                <p>CPD Points (This Year)</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="leaderboard-section">
            <h2>Monthly Leaderboard</h2>
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Teacher</th>
                  <th>XP</th>
                  <th>Level</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((teacher, index) => (
                  <tr key={teacher._id}>
                    <td>#{index + 1}</td>
                    <td>{teacher.userId?.firstName} {teacher.userId?.lastName}</td>
                    <td>{teacher.leaderboardScore}</td>
                    <td>{teacher.currentLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="challenges-section">
            <h2>Active Challenges</h2>
            <div className="challenges-grid">
              {challenges.map((challenge) => (
                <div key={challenge._id} className="challenge-card">
                  <h3>{challenge.title}</h3>
                  <p>{challenge.description}</p>
                  <div className="challenge-info">
                    <span>⭐ {challenge.xpReward} XP</span>
                    <span>📊 {challenge.totalParticipants} participants</span>
                  </div>
                  <button className="btn btn-primary">Join Challenge</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamificationPage;
