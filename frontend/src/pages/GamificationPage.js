import React, { useEffect, useMemo, useState } from 'react';
import { gamificationAPI } from '../utils/api';
import { useAuthStore } from '../context/store';
import toast from 'react-hot-toast';
import '../styles/gamification.css';

const GamificationPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, achievementsRes, leaderboardRes, challengesRes] = await Promise.all([
        gamificationAPI.getStats(),
        gamificationAPI.getAchievements(),
        gamificationAPI.getLeaderboard(),
        gamificationAPI.getChallenges(),
      ]);

      setStats(statsRes?.data?.gamification || null);
      setAchievements(achievementsRes?.data?.achievements || []);
      setLeaderboard(leaderboardRes?.data?.leaderboard || []);
      setChallenges(challengesRes?.data?.challenges || []);
    } catch (error) {
      toast.error('Failed to load gamification data');
    } finally {
      setIsLoading(false);
    }
  };

  const getParticipation = (challenge) => {
    if (!challenge?.participants || !user?._id) return null;
    return challenge.participants.find((participant) => String(participant.userId) === String(user._id)) || null;
  };

  const handleJoinChallenge = async (challengeId) => {
    setActionLoading((previous) => ({ ...previous, [challengeId]: true }));
    try {
      await gamificationAPI.joinChallenge(challengeId);
      toast.success('Joined challenge');
      await loadGamificationData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to join challenge');
    } finally {
      setActionLoading((previous) => ({ ...previous, [challengeId]: false }));
    }
  };

  const handleCompleteChallenge = async (challengeId) => {
    setActionLoading((previous) => ({ ...previous, [challengeId]: true }));
    try {
      await gamificationAPI.completeChallenge(challengeId);
      toast.success('Challenge completed');
      await loadGamificationData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to complete challenge');
    } finally {
      setActionLoading((previous) => ({ ...previous, [challengeId]: false }));
    }
  };

  const unlockedBadgeNames = useMemo(() => {
    const map = {};
    (stats?.unlockedBadges || []).forEach((badge) => {
      if (badge?.badgeName) map[badge.badgeName] = true;
    });
    return map;
  }, [stats]);

  return (
    <div className="gamification-page">
      <div className="gamification-container">
        <div className="gamification-header">
          <h1>🏆 Your Achievement Journey</h1>
        </div>

        <div className="tab-navigation">
          <button
            className={activeTab === 'overview' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={activeTab === 'badges' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('badges')}
          >
            Badges
          </button>
          <button
            className={activeTab === 'leaderboard' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('leaderboard')}
          >
            Leaderboard
          </button>
          <button
            className={activeTab === 'challenges' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('challenges')}
          >
            Challenges
          </button>
        </div>

        <div className="tab-content">
          {isLoading && <p className="gamification-empty">Loading...</p>}

          {!isLoading && activeTab === 'overview' && (
            <div className="overview-stats">
              <div className="overview-stat-card">
                <h3>Current Level</h3>
                <p className="big-number">{stats?.currentLevel || 1}</p>
              </div>
              <div className="overview-stat-card">
                <h3>Total XP</h3>
                <p className="big-number">{stats?.totalXP || 0}</p>
              </div>
              <div className="overview-stat-card">
                <h3>Badges Earned</h3>
                <p className="big-number">{stats?.unlockedBadges?.length || 0}</p>
              </div>
              <div className="overview-stat-card">
                <h3>CPD Points This Year</h3>
                <p className="big-number">{stats?.cpdPointsThisYear || 0}</p>
              </div>
            </div>
          )}

          {!isLoading && activeTab === 'badges' && (
            <>
              {achievements.length === 0 ? (
                <p className="gamification-empty">No badges configured yet.</p>
              ) : (
                <div className="badges-grid">
                  {achievements.map((badge) => {
                    const unlocked = Boolean(unlockedBadgeNames[badge.name]);
                    return (
                      <div
                        key={badge._id}
                        className="badge-item"
                        style={{ opacity: unlocked ? 1 : 0.5 }}
                      >
                        <div className="badge-icon">{badge.icon || '🏅'}</div>
                        <p className="badge-name">{badge.name}</p>
                        <p className="badge-rarity">{badge.rarity || 'uncommon'}</p>
                        <p style={{ marginTop: '0.4rem', fontSize: '0.8rem' }}>
                          {unlocked ? 'Unlocked' : 'Locked'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {!isLoading && activeTab === 'leaderboard' && (
            <>
              {leaderboard.length === 0 ? (
                <p className="gamification-empty">No leaderboard data yet.</p>
              ) : (
                <div className="leaderboard-table">
                  <table>
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
                          <td className={`rank-cell ${index < 3 ? `rank-${index + 1}` : ''}`}>
                            #{index + 1}
                          </td>
                          <td>
                            <div className="teacher-cell">
                              <div className="teacher-avatar">
                                {(teacher.userId?.firstName || 'T').charAt(0).toUpperCase()}
                              </div>
                              <span className="teacher-name">
                                {teacher.userId?.firstName || 'Teacher'} {teacher.userId?.lastName || ''}
                              </span>
                            </div>
                          </td>
                          <td className="xp-cell">{teacher.leaderboardScore || 0}</td>
                          <td>
                            <span className="level-badge">Lv {teacher.currentLevel || 1}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {!isLoading && activeTab === 'challenges' && (
            <>
              {challenges.length === 0 ? (
                <p className="gamification-empty">No active challenges right now.</p>
              ) : (
                <div className="challenges-grid">
                  {challenges.map((challenge) => {
                    const participation = getParticipation(challenge);
                    const joined = Boolean(participation);
                    const completed = Boolean(participation?.completed);
                    const busy = Boolean(actionLoading[challenge._id]);

                    return (
                      <div key={challenge._id} className="challenge-card">
                        <div className="challenge-header">
                          <h3 className="challenge-title">{challenge.title}</h3>
                          <span className="challenge-difficulty">{challenge.difficulty || 'medium'}</span>
                        </div>

                        <p className="challenge-description">{challenge.description || 'No description yet.'}</p>

                        <div className="challenge-stats">
                          <div className="stat-item">
                            <p className="stat-label">XP Reward</p>
                            <p className="stat-value">{challenge.xpReward || 0}</p>
                          </div>
                          <div className="stat-item">
                            <p className="stat-label">Participants</p>
                            <p className="stat-value">{challenge.totalParticipants || 0}</p>
                          </div>
                        </div>

                        {!joined && (
                          <button
                            className="challenge-action"
                            onClick={() => handleJoinChallenge(challenge._id)}
                            disabled={busy}
                          >
                            {busy ? 'Joining...' : 'Join Challenge'}
                          </button>
                        )}

                        {joined && !completed && (
                          <button
                            className="challenge-action"
                            onClick={() => handleCompleteChallenge(challenge._id)}
                            disabled={busy}
                          >
                            {busy ? 'Completing...' : 'Mark Complete'}
                          </button>
                        )}

                        {joined && completed && (
                          <button className="challenge-action challenge-action-completed" disabled>
                            Completed
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamificationPage;
