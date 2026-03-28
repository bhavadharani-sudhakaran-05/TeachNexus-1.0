import React, { useMemo, useState, useEffect } from 'react';
import { communityAPI } from '../utils/api';
import { useAuthStore } from '../context/store';
import toast from 'react-hot-toast';
import { FaComments, FaPlus, FaSearch, FaUsers, FaThumbsUp, FaReply } from 'react-icons/fa';
import '../styles/community.css';

const CommunityPage = () => {
  const { user } = useAuthStore();
  const [communities, setCommunities] = useState([]);
  const [threads, setThreads] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(false);
  const [isLoadingThreads, setIsLoadingThreads] = useState(false);
  const [communitySearch, setCommunitySearch] = useState('');
  const [threadSearch, setThreadSearch] = useState('');
  const [showCommunityForm, setShowCommunityForm] = useState(false);
  const [showThreadForm, setShowThreadForm] = useState(false);
  const [replyDrafts, setReplyDrafts] = useState({});

  const [communityForm, setCommunityForm] = useState({
    name: '',
    description: '',
    subject: '',
    gradeLevels: '',
    icon: '👥',
    color: '#1e3a5f',
  });

  const [threadForm, setThreadForm] = useState({
    title: '',
    content: '',
    category: 'discussion',
    tags: '',
  });

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    setIsLoadingCommunities(true);
    try {
      const response = await communityAPI.getCommunities({ limit: 50 });
      const incomingCommunities = response.data.communities || [];
      setCommunities(incomingCommunities);

      if (incomingCommunities.length > 0) {
        const firstCommunity = incomingCommunities[0];
        setSelectedCommunity(firstCommunity);
        loadThreads(firstCommunity._id);
      }
    } catch (error) {
      toast.error('Failed to load communities');
    } finally {
      setIsLoadingCommunities(false);
    }
  };

  const loadThreads = async (communityId) => {
    setIsLoadingThreads(true);
    try {
      const response = await communityAPI.getThreads(communityId, { limit: 50 });
      setThreads(response.data.threads || []);
    } catch (error) {
      toast.error('Failed to load discussions');
      setThreads([]);
    } finally {
      setIsLoadingThreads(false);
    }
  };

  const selectCommunity = async (community) => {
    setSelectedCommunity(community);
    await loadThreads(community._id);
  };

  const isCurrentUserMember = useMemo(() => {
    if (!selectedCommunity || !user?._id) return false;
    return (selectedCommunity.members || []).some(
      (member) => String(member.userId) === String(user._id)
    );
  }, [selectedCommunity, user]);

  const filteredCommunities = useMemo(() => {
    const term = communitySearch.trim().toLowerCase();
    if (!term) return communities;

    return communities.filter(
      (community) =>
        community.name?.toLowerCase().includes(term) ||
        community.description?.toLowerCase().includes(term) ||
        community.subject?.toLowerCase().includes(term)
    );
  }, [communities, communitySearch]);

  const filteredThreads = useMemo(() => {
    const term = threadSearch.trim().toLowerCase();
    if (!term) return threads;

    return threads.filter(
      (thread) =>
        thread.title?.toLowerCase().includes(term) ||
        thread.content?.toLowerCase().includes(term) ||
        thread.category?.toLowerCase().includes(term)
    );
  }, [threads, threadSearch]);

  const handleJoinCommunity = async (communityId) => {
    try {
      await communityAPI.joinCommunity(communityId);
      toast.success('Joined community successfully');
      await loadCommunities();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join community');
    }
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: communityForm.name.trim(),
        description: communityForm.description.trim(),
        subject: communityForm.subject.trim(),
        gradeLevels: communityForm.gradeLevels
          .split(',')
          .map((level) => level.trim())
          .filter(Boolean),
        icon: communityForm.icon,
        color: communityForm.color,
      };

      await communityAPI.createCommunity(payload);
      toast.success('Community created');
      setShowCommunityForm(false);
      setCommunityForm({
        name: '',
        description: '',
        subject: '',
        gradeLevels: '',
        icon: '👥',
        color: '#1e3a5f',
      });
      await loadCommunities();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create community');
    }
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!selectedCommunity) return;

    try {
      const payload = {
        title: threadForm.title.trim(),
        content: threadForm.content.trim(),
        category: threadForm.category,
        tags: threadForm.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      await communityAPI.createThread(selectedCommunity._id, payload);
      toast.success('Discussion posted');
      setShowThreadForm(false);
      setThreadForm({
        title: '',
        content: '',
        category: 'discussion',
        tags: '',
      });
      await loadThreads(selectedCommunity._id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create discussion');
    }
  };

  const handleLikeThread = async (threadId) => {
    if (!selectedCommunity) return;
    try {
      const response = await communityAPI.likeThread(selectedCommunity._id, threadId);
      const updatedThread = response.data.thread;
      setThreads((previousThreads) =>
        previousThreads.map((thread) => (thread._id === threadId ? updatedThread : thread))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to like discussion');
    }
  };

  const handleAddReply = async (threadId) => {
    if (!selectedCommunity) return;
    const content = replyDrafts[threadId]?.trim();

    if (!content) {
      toast.error('Please write a reply first');
      return;
    }

    try {
      const response = await communityAPI.addReply(selectedCommunity._id, threadId, { content });
      const updatedThread = response.data.thread;
      setThreads((previousThreads) =>
        previousThreads.map((thread) => (thread._id === threadId ? updatedThread : thread))
      );
      setReplyDrafts((previousDrafts) => ({ ...previousDrafts, [threadId]: '' }));
      toast.success('Reply posted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add reply');
    }
  };

  const communityCount = communities.length;
  const totalMembers = communities.reduce((sum, community) => sum + (community.memberCount || 0), 0);
  const totalThreads = communities.reduce((sum, community) => sum + (community.totalPosts || 0), 0);

  return (
    <div className="community-page">
      <div className="community-container">
        <div className="community-hero">
          <div>
            <h1>Teacher Communities</h1>
            <p>Find peers, exchange ideas, and keep great classroom conversations moving.</p>
          </div>
          <button className="community-primary-btn" onClick={() => setShowCommunityForm(true)}>
            <FaPlus /> Create Community
          </button>
        </div>

        <div className="community-stats-grid">
          <div className="community-stat-card">
            <FaUsers className="community-stat-icon" />
            <div>
              <h3>{communityCount}</h3>
              <p>Communities</p>
            </div>
          </div>
          <div className="community-stat-card">
            <FaComments className="community-stat-icon" />
            <div>
              <h3>{totalThreads}</h3>
              <p>Total Posts</p>
            </div>
          </div>
          <div className="community-stat-card">
            <FaUsers className="community-stat-icon" />
            <div>
              <h3>{totalMembers}</h3>
              <p>Total Members</p>
            </div>
          </div>
        </div>

        <div className="community-layout">
          <div className="communities-sidebar">
            <div className="community-section-header">
              <h2>Communities</h2>
            </div>
            <div className="community-search">
              <FaSearch />
              <input
                type="text"
                placeholder="Search communities"
                value={communitySearch}
                onChange={(e) => setCommunitySearch(e.target.value)}
              />
            </div>
            <div className="communities-list">
              {isLoadingCommunities ? (
                <div className="loading">Loading...</div>
              ) : filteredCommunities.length === 0 ? (
                <div className="no-results">No communities found.</div>
              ) : (
                filteredCommunities.map((community) => (
                  <div
                    key={community._id}
                    className={`community-item ${selectedCommunity?._id === community._id ? 'active' : ''}`}
                    onClick={() => selectCommunity(community)}
                  >
                    <div
                      className="community-avatar"
                      style={{ backgroundColor: community.color || '#1e3a5f' }}
                    >
                      {community.icon || '👥'}
                    </div>
                    <div className="community-item-content">
                      <h4>{community.name}</h4>
                      <p>{community.memberCount || 0} members</p>
                      <small>{community.subject}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="discussions-main">
            {selectedCommunity ? (
              <>
                <div className="community-header">
                  <div>
                    <h2>{selectedCommunity.name}</h2>
                    <p>{selectedCommunity.description}</p>
                    <div className="community-tags">
                      <span>{selectedCommunity.subject}</span>
                      {(selectedCommunity.gradeLevels || []).slice(0, 3).map((level) => (
                        <span key={level}>{level}</span>
                      ))}
                    </div>
                  </div>
                  <div className="community-header-actions">
                    {!isCurrentUserMember && (
                      <button
                        className="community-primary-btn"
                        onClick={() => handleJoinCommunity(selectedCommunity._id)}
                      >
                        Join Community
                      </button>
                    )}
                    <button
                      className="community-secondary-btn"
                      onClick={() => setShowThreadForm(true)}
                      disabled={!isCurrentUserMember}
                      title={isCurrentUserMember ? 'Start a new discussion' : 'Join this community first'}
                    >
                      <FaPlus /> New Discussion
                    </button>
                  </div>
                </div>

                <div className="community-search thread-search">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search discussions"
                    value={threadSearch}
                    onChange={(e) => setThreadSearch(e.target.value)}
                  />
                </div>

                <div className="discussions-list">
                  {isLoadingThreads ? (
                    <div className="loading">Loading discussions...</div>
                  ) : filteredThreads.length > 0 ? (
                    filteredThreads.map((discussion) => (
                      <div key={discussion._id} className="discussion-card">
                        <h3>{discussion.title}</h3>
                        <p>{discussion.content}</p>
                        <div className="discussion-category-row">
                          <span className="category-pill">{discussion.category}</span>
                        </div>
                        <div className="discussion-footer">
                          <span>👤 {discussion.author?.firstName || 'Teacher'}</span>
                          <span>💬 {discussion.replies?.length || 0}</span>
                          <span>👍 {discussion.likes || 0}</span>
                        </div>
                        <div className="discussion-actions-row">
                          <button
                            type="button"
                            className="inline-action-btn"
                            onClick={() => handleLikeThread(discussion._id)}
                          >
                            <FaThumbsUp /> Like
                          </button>
                        </div>

                        <div className="reply-editor">
                          <textarea
                            placeholder="Add a reply..."
                            value={replyDrafts[discussion._id] || ''}
                            onChange={(e) =>
                              setReplyDrafts((previousDrafts) => ({
                                ...previousDrafts,
                                [discussion._id]: e.target.value,
                              }))
                            }
                          />
                          <button
                            type="button"
                            className="inline-action-btn"
                            onClick={() => handleAddReply(discussion._id)}
                            disabled={!isCurrentUserMember}
                          >
                            <FaReply /> Reply
                          </button>
                        </div>

                        {(discussion.replies || []).slice(-3).map((reply) => (
                          <div key={reply._id} className="reply-item">
                            <p>{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    ))
                  ) : (
                    <div className="no-results">No discussions found. Start one!</div>
                  )}
                </div>
              </>
            ) : (
              <div className="placeholder">Select a community to view discussions</div>
            )}
          </div>
        </div>

        {showCommunityForm && (
          <div className="community-modal-overlay" onClick={() => setShowCommunityForm(false)}>
            <div className="community-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Create Community</h3>
              <form onSubmit={handleCreateCommunity}>
                <input
                  required
                  placeholder="Community name"
                  value={communityForm.name}
                  onChange={(e) => setCommunityForm({ ...communityForm, name: e.target.value })}
                />
                <textarea
                  required
                  placeholder="Description"
                  value={communityForm.description}
                  onChange={(e) =>
                    setCommunityForm({ ...communityForm, description: e.target.value })
                  }
                />
                <input
                  required
                  placeholder="Subject (e.g. Mathematics)"
                  value={communityForm.subject}
                  onChange={(e) => setCommunityForm({ ...communityForm, subject: e.target.value })}
                />
                <input
                  placeholder="Grade levels (comma separated)"
                  value={communityForm.gradeLevels}
                  onChange={(e) =>
                    setCommunityForm({ ...communityForm, gradeLevels: e.target.value })
                  }
                />
                <div className="modal-row">
                  <input
                    placeholder="Icon"
                    value={communityForm.icon}
                    onChange={(e) => setCommunityForm({ ...communityForm, icon: e.target.value })}
                  />
                  <input
                    type="color"
                    value={communityForm.color}
                    onChange={(e) => setCommunityForm({ ...communityForm, color: e.target.value })}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="community-secondary-btn" onClick={() => setShowCommunityForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="community-primary-btn">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showThreadForm && (
          <div className="community-modal-overlay" onClick={() => setShowThreadForm(false)}>
            <div className="community-modal" onClick={(e) => e.stopPropagation()}>
              <h3>New Discussion</h3>
              <form onSubmit={handleCreateThread}>
                <input
                  required
                  placeholder="Discussion title"
                  value={threadForm.title}
                  onChange={(e) => setThreadForm({ ...threadForm, title: e.target.value })}
                />
                <textarea
                  required
                  placeholder="Describe your question or idea"
                  value={threadForm.content}
                  onChange={(e) => setThreadForm({ ...threadForm, content: e.target.value })}
                />
                <select
                  value={threadForm.category}
                  onChange={(e) => setThreadForm({ ...threadForm, category: e.target.value })}
                >
                  <option value="discussion">Discussion</option>
                  <option value="question">Question</option>
                  <option value="resource_share">Resource Share</option>
                  <option value="poll">Poll</option>
                  <option value="announcement">Announcement</option>
                </select>
                <input
                  placeholder="Tags (comma separated)"
                  value={threadForm.tags}
                  onChange={(e) => setThreadForm({ ...threadForm, tags: e.target.value })}
                />
                <div className="modal-actions">
                  <button type="button" className="community-secondary-btn" onClick={() => setShowThreadForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="community-primary-btn">
                    Post Discussion
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
