import React, { useState, useEffect } from 'react';
import { communityAPI } from '../utils/api';
import toast from 'react-hot-toast';
import '../styles/community.css';

const CommunityPage = () => {
  const [communities, setCommunities] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    setIsLoading(true);
    try {
      const response = await communityAPI.getCommunities({});
      setCommunities(response.data.communities);
    } catch (error) {
      toast.error('Failed to load communities');
    } finally {
      setIsLoading(false);
    }
  };

  const selectCommunity = async (community) => {
    setSelectedCommunity(community);
    try {
      const response = await communityAPI.getThreads(community._id, {});
      setDiscussions(response.data.threads);
    } catch (error) {
      toast.error('Failed to load discussions');
    }
  };

  return (
    <div className="community-page">
      <div className="container">
        <h1>👥 Teacher Communities</h1>

        <div className="community-layout">
          {/* Communities List */}
          <div className="communities-sidebar">
            <h2>Communities</h2>
            <div className="communities-list">
              {isLoading ? (
                <div className="loading">Loading...</div>
              ) : (
                communities.map((community) => (
                  <div
                    key={community._id}
                    className={`community-item ${selectedCommunity?._id === community._id ? 'active' : ''}`}
                    onClick={() => selectCommunity(community)}
                  >
                    <div className="community-avatar" style={{ backgroundColor: community.color }}>
                      {community.icon}
                    </div>
                    <div>
                      <h4>{community.name}</h4>
                      <p>{community.memberCount} members</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Discussions */}
          <div className="discussions-main">
            {selectedCommunity ? (
              <>
                <div className="community-header">
                  <h2>{selectedCommunity.name}</h2>
                  <p>{selectedCommunity.description}</p>
                </div>

                <div className="discussions-list">
                  {discussions.length > 0 ? (
                    discussions.map((discussion) => (
                      <div key={discussion._id} className="discussion-card">
                        <h3>{discussion.title}</h3>
                        <p>{discussion.content}</p>
                        <div className="discussion-footer">
                          <span>👤 {discussion.author?.firstName}</span>
                          <span>💬 {discussion.replies?.length || 0}</span>
                          <span>👍 {discussion.likes}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-results">No discussions yet. Start one!</div>
                  )}
                </div>
              </>
            ) : (
              <div className="placeholder">Select a community to view discussions</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
