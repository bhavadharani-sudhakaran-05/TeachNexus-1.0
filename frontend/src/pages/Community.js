import React, { useState, useEffect } from 'react';
import {
  FaUsers,
  FaComments,
  FaPlus,
  FaSearch,
  FaThumbsUp,
  FaReply,
  FaFire,
  FaStar,
  FaTrophy,
} from 'react-icons/fa';
import '../styles/community.css';

const Community = () => {
  const [activeTab, setActiveTab] = useState('groups'); // groups, forums, members
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: 'Mathematics Teachers',
      description: 'Discuss math curriculum, resources, and teaching strategies',
      members: 342,
      category: 'Subject',
      image: '🔢',
      trending: true,
      posts: 1250,
    },
    {
      id: 2,
      name: 'Science Lab Enthusiasts',
      description: 'Share lab experiments, safety tips, and STEM activities',
      members: 285,
      category: 'Subject',
      image: '🧪',
      trending: false,
      posts: 890,
    },
    {
      id: 3,
      name: 'Elementary Teachers Network',
      description: 'Connect with elementary school educators worldwide',
      members: 567,
      category: 'Grade Level',
      image: '🎓',
      trending: true,
      posts: 2100,
    },
  ]);

  const [forums, setForums] = useState([
    {
      id: 1,
      title: 'How to engage remote students better?',
      author: 'Sarah Johnson',
      category: 'Teaching Tips',
      replies: 24,
      views: 342,
      likes: 45,
      timestamp: '2 hours ago',
      solved: false,
    },
    {
      id: 2,
      title: 'Best assessment methods for online classes',
      author: 'Michael Chen',
      category: 'Assessment',
      replies: 18,
      views: 267,
      likes: 38,
      timestamp: '5 hours ago',
      solved: true,
    },
    {
      id: 3,
      title: 'Free resources for special education',
      author: 'Emma Wilson',
      category: 'Resources',
      replies: 31,
      views: 456,
      likes: 67,
      timestamp: '1 day ago',
      solved: true,
    },
  ]);

  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      subject: 'Mathematics',
      level: 5,
      badge: '⭐ Expert',
      reputation: 1240,
      posts: 156,
      avatar: '👩‍🏫',
    },
    {
      id: 2,
      name: 'Michael Chen',
      subject: 'Physics',
      level: 4,
      badge: '🏆 Mentor',
      reputation: 980,
      posts: 108,
      avatar: '👨‍🏫',
    },
    {
      id: 3,
      name: 'Emma Wilson',
      subject: 'Special Education',
      level: 4,
      badge: '⭐ Expert',
      reputation: 1120,
      posts: 142,
      avatar: '👩‍🏫',
    },
  ]);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredForums = forums.filter((forum) =>
    forum.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="community-page">
      <div className="community-container">
        {/* Header */}
        <div className="community-header">
          <div>
            <h1>👥 Teacher Community</h1>
            <p>Connect, collaborate, and learn with educators worldwide</p>
          </div>
          <button className="btn-create-group">
            <FaPlus /> Create Group
          </button>
        </div>

        {/* Stats Banner */}
        <div className="stats-banner">
          <div className="stat">
            <FaUsers className="stat-icon" />
            <div>
              <h3>3.2K</h3>
              <p>Active Teachers</p>
            </div>
          </div>
          <div className="stat">
            <FaComments className="stat-icon" />
            <div>
              <h3>12.5K</h3>
              <p>Discussion Posts</p>
            </div>
          </div>
          <div className="stat">
            <FaFire className="stat-icon" />
            <div>
              <h3>285</h3>
              <p>Resources Shared</p>
            </div>
          </div>
          <div className="stat">
            <FaTrophy className="stat-icon" />
            <div>
              <h3>94%</h3>
              <p>Engagement Rate</p>
            </div>
          </div>
        </div>

        {/* Tabs & Search */}
        <div className="community-controls">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'groups' ? 'active' : ''}`}
              onClick={() => setActiveTab('groups')}
            >
              <FaUsers /> Groups ({groups.length})
            </button>
            <button
              className={`tab ${activeTab === 'forums' ? 'active' : ''}`}
              onClick={() => setActiveTab('forums')}
            >
              <FaComments /> Forums ({forums.length})
            </button>
            <button
              className={`tab ${activeTab === 'members' ? 'active' : ''}`}
              onClick={() => setActiveTab('members')}
            >
              <FaStar /> Members ({members.length})
            </button>
          </div>

          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        {activeTab === 'groups' && (
          <div className="content-section">
            <div className="groups-grid">
              {filteredGroups.map((group) => (
                <div key={group.id} className="group-card">
                  {group.trending && <span className="trending-badge">🔥 Trending</span>}
                  <div className="group-header">
                    <span className="group-image">{group.image}</span>
                    <div>
                      <h3>{group.name}</h3>
                      <span className="group-category">{group.category}</span>
                    </div>
                  </div>
                  <p className="group-description">{group.description}</p>
                  <div className="group-stats">
                    <span>👥 {group.members} members</span>
                    <span>💬 {group.posts} posts</span>
                  </div>
                  <button className="btn-join">Join Group</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'forums' && (
          <div className="content-section">
            <div className="forums-list">
              {filteredForums.map((forum) => (
                <div key={forum.id} className="forum-card">
                  <div className="forum-header">
                    <div className="forum-info">
                      <div className="forum-title-row">
                        <h3>{forum.title}</h3>
                        {forum.solved && <span className="solved-badge">✅ Solved</span>}
                      </div>
                      <div className="forum-meta">
                        <span>by {forum.author}</span>
                        <span>•</span>
                        <span>{forum.timestamp}</span>
                        <span>•</span>
                        <span className="category-tag">{forum.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="forum-stats">
                    <span>
                      <FaReply /> {forum.replies} replies
                    </span>
                    <span>👁️ {forum.views} views</span>
                    <span>
                      <FaThumbsUp /> {forum.likes} likes
                    </span>
                  </div>

                  <button className="btn-discuss">View Discussion →</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="content-section">
            <div className="members-grid">
              {filteredMembers.map((member) => (
                <div key={member.id} className="member-card">
                  <div className="member-avatar">{member.avatar}</div>
                  <h3>{member.name}</h3>
                  <span className="member-subject">{member.subject}</span>
                  <span className="member-badge">{member.badge}</span>

                  <div className="member-stats">
                    <div>
                      <p className="stat-value">{member.reputation}</p>
                      <p className="stat-label">Reputation</p>
                    </div>
                    <div>
                      <p className="stat-value">{member.posts}</p>
                      <p className="stat-label">Posts</p>
                    </div>
                  </div>

                  <button className="btn-follow">Follow</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
