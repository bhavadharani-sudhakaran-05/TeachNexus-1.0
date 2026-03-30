import React, { useState, useEffect } from 'react';
import { resourceAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FaSearch, FaThLarge, FaList, FaUpload, FaStar, FaDownload, FaTimes, FaShare, FaHeart, FaFileUpload } from 'react-icons/fa';
import '../styles/resources.css';

const ResourceLibrary = () => {
  const [resources, setResources] = useState([]);
  const [relatedResources, setRelatedResources] = useState([]);
  const [filters, setFilters] = useState({ subject: '', gradeLevel: '', resourceType: '', search: '' });
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRemixModal, setShowRemixModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [collections, setCollections] = useState([]);
  const [showCollectionsModal, setShowCollectionsModal] = useState(false);

  // Detail view states
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Upload states
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadDragActive, setUploadDragActive] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    description: '',
    subject: '',
    gradeLevel: '',
    resourceType: '',
    skillTags: [],
  });

  useEffect(() => {
    loadResources();
    loadFavorites();
    loadCollections();
  }, [filters, sortBy]);

  useEffect(() => {
    if (showDetailModal && selectedResource) {
      loadRelatedResources();
    }
  }, [showDetailModal, selectedResource]);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const response = await resourceAPI.getResources({ ...filters, sortBy });
      setResources(response.data.resources || []);
    } catch (error) {
      console.log('No resources available yet');
      setResources([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await resourceAPI.getFavorites();
      setFavorites(response.data.favorites || []);
    } catch (error) {
      console.log('Could not load favorites');
    }
  };

  // Upload handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setUploadFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUploadChange = (e) => {
    const { name, value } = e.target;
    setUploadFormData({ ...uploadFormData, [name]: value });
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadFormData.title || !uploadFormData.subject) {
      toast.error('Please fill in required fields');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', uploadFormData.title);
    formData.append('description', uploadFormData.description);
    formData.append('subject', uploadFormData.subject);
    formData.append('gradeLevel', uploadFormData.gradeLevel);
    formData.append('resourceType', uploadFormData.resourceType);

    try {
      await resourceAPI.uploadResource(formData);
      toast.success('Resource uploaded successfully!');
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadFormData({ title: '', description: '', subject: '', gradeLevel: '', resourceType: '', skillTags: [] });
      loadResources();
    } catch (error) {
      toast.error('Failed to upload resource');
    }
  };

  // Resource interactions
  const handleDownload = async (resourceId) => {
    try {
      await resourceAPI.downloadResource(resourceId);
      const resource = resources.find(r => r._id === resourceId);
      toast.success(`Downloading: ${resource.title}`);
    } catch (error) {
      toast.error('Failed to download resource');
    }
  };

  const handleFavorite = async (resourceId) => {
    try {
      await resourceAPI.toggleFavorite(resourceId);
      setFavorites(favorites.includes(resourceId)
        ? favorites.filter(id => id !== resourceId)
        : [...favorites, resourceId]
      );
      toast.success(favorites.includes(resourceId) ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const handleRemix = async (e) => {
    e.preventDefault();
    if (!selectedResource) return;

    try {
      await resourceAPI.remixResource(selectedResource._id, {
        title: selectedResource.title,
        description: selectedResource.description,
      });
      toast.success('Resource remixed! Creating your version...');
      setShowRemixModal(false);
      setShowDetailModal(false);
      loadResources();
    } catch (error) {
      toast.error('Failed to remix resource');
    }
  };

  const loadRelatedResources = async () => {
    try {
      const response = await resourceAPI.getResources({
        subject: selectedResource.subject,
        exclude: selectedResource._id,
        limit: 4,
      });
      setRelatedResources(response.data.resources || []);
    } catch (error) {
      console.log('Could not load related resources');
    }
  };

  const loadCollections = async () => {
    try {
      const response = await resourceAPI.getCollections();
      setCollections(response.data.collections || []);
    } catch (error) {
      console.log('Could not load collections');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userRating || !reviewText.trim()) {
      toast.error('Please provide a rating and review');
      return;
    }

    try {
      await resourceAPI.addReview(selectedResource._id, {
        rating: userRating,
        comment: reviewText,
      });
      toast.success('Review submitted successfully!');
      setReviewText('');
      setUserRating(0);
      setShowReviewForm(false);
      // Reload resource to get updated reviews
      loadResources();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const handleAddToCollection = async (collectionId) => {
    try {
      await resourceAPI.addToCollection(collectionId, selectedResource._id);
      toast.success('Resource added to collection!');
    } catch (error) {
      toast.error('Failed to add resource to collection');
    }
  };

  return (
    <div className="resource-library-page">
      <div className="library-container">
        {/* Header */}
        <div className="library-header">
          <div className="header-top">
            <div>
              <h1>📚 Resource Library</h1>
              <p>Discover and share educational resources</p>
            </div>
            <button className="btn-upload" onClick={() => setShowUploadModal(true)}>
              <FaUpload /> Upload Resource
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="search-filters">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search resources..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>Subject</label>
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            >
              <option value="">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="History">History</option>
              <option value="Social Studies">Social Studies</option>
              <option value="Art">Art</option>
              <option value="Music">Music</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Grade Level</label>
            <select
              value={filters.gradeLevel}
              onChange={(e) => setFilters({ ...filters, gradeLevel: e.target.value })}
            >
              <option value="">All Grades</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Type</label>
            <select
              value={filters.resourceType}
              onChange={(e) => setFilters({ ...filters, resourceType: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="lesson_plan">Lesson Plan</option>
              <option value="worksheet">Worksheet</option>
              <option value="assessment">Assessment</option>
              <option value="presentation">Presentation</option>
              <option value="video">Video</option>
              <option value="article">Article</option>
              <option value="interactive_tool">Interactive Tool</option>
              <option value="project">Project</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">Most Recent</option>
              <option value="popular">Most Downloaded</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <FaThLarge />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <FaList />
            </button>
          </div>
        </div>

        {/* Resources Grid/List */}
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading resources...</p>
          </div>
        ) : resources.length > 0 ? (
          <div className={`resources-${viewMode === 'grid' ? 'grid' : 'list'}`}>
            {resources.map((resource) => (
              viewMode === 'grid' ? (
                <div key={resource._id} className="resource-card">
                  <div className="resource-card-image">
                    {resource.thumbnail ? (
                      <img src={resource.thumbnail} alt={resource.title} />
                    ) : (
                      <span>📄</span>
                    )}
                  </div>
                  <div className="resource-card-body">
                    <h3 className="resource-card-title">{resource.title}</h3>
                    <p className="resource-card-description">{resource.description}</p>

                    <div className="resource-meta-info">
                      <span className="meta-badge">{resource.subject}</span>
                      <span className="meta-badge">{resource.gradeLevel}</span>
                      <span className="meta-badge">{resource.resourceType}</span>
                    </div>

                    <div className="resource-stats">
                      <div className="resource-rating">
                        <FaStar className="star" />
                        <span>{resource.rating?.averageRating?.toFixed(1) || '0.0'}</span>
                      </div>
                      <span className="download-count">
                        <FaDownload /> {resource.downloads || 0}
                      </span>
                    </div>

                    <div className="resource-actions">
                      <button
                        className="btn-download"
                        onClick={() => handleDownload(resource._id)}
                      >
                        <FaDownload /> Download
                      </button>
                      <button
                        className={`btn-favorite ${favorites.includes(resource._id) ? 'favorited' : ''}`}
                        onClick={() => handleFavorite(resource._id)}
                      >
                        <FaHeart />
                      </button>
                      <button
                        className="btn-preview"
                        onClick={() => {
                          setSelectedResource(resource);
                          setShowDetailModal(true);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={resource._id} className="resource-item">
                  <div className="resource-item-image">
                    {resource.thumbnail ? (
                      <img src={resource.thumbnail} alt={resource.title} />
                    ) : (
                      <span>📄</span>
                    )}
                  </div>
                  <div className="resource-item-content">
                    <div className="resource-item-header">
                      <h3 className="resource-item-title">{resource.title}</h3>
                      <span className="resource-item-badge">{resource.resourceType}</span>
                    </div>
                    <p className="resource-item-description">{resource.description}</p>
                    <div className="resource-item-footer">
                      <div>
                        <span>{resource.subject} • {resource.gradeLevel}</span>
                      </div>
                      <div className="resource-item-stats">
                        <span>
                          <FaStar className="star" /> {resource.rating?.averageRating?.toFixed(1) || '0.0'}
                        </span>
                        <span>
                          <FaDownload /> {resource.downloads || 0}
                        </span>
                        <button
                          className={`btn-heart ${favorites.includes(resource._id) ? 'favorited' : ''}`}
                          onClick={() => handleFavorite(resource._id)}
                        >
                          <FaHeart />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">📚</div>
            <p className="no-results-text">No resources found. Try adjusting your filters.</p>
            <button className="btn-upload-cta" onClick={() => setShowUploadModal(true)}>
              <FaUpload /> Upload Your First Resource
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Resource</h2>
              <button className="btn-close" onClick={() => setShowUploadModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="upload-form">
              {/* Drag & Drop Zone */}
              <div
                className={`drag-drop-zone ${uploadDragActive ? 'active' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {uploadFile ? (
                  <div className="file-selected">
                    <FaFileUpload style={{ fontSize: '2rem', color: '#f59e0b' }} />
                    <p>{uploadFile.name}</p>
                    <small>{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</small>
                  </div>
                ) : (
                  <>
                    <FaFileUpload style={{ fontSize: '2rem', color: '#f59e0b' }} />
                    <p>Drag your file here or click to browse</p>
                    <small>Supported: PDF, DOCX, PPTX, Image files</small>
                  </>
                )}
                <input
                  type="file"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  id="file-input"
                />
              </div>

              {/* Form Fields */}
              <div className="form-grid">
                <div className="form-group full">
                  <label>Resource Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={uploadFormData.title}
                    onChange={handleUploadChange}
                    placeholder="e.g., Photosynthesis Lesson Plan"
                    required
                  />
                </div>

                <div className="form-group full">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={uploadFormData.description}
                    onChange={handleUploadChange}
                    placeholder="Describe your resource..."
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <select
                    name="subject"
                    value={uploadFormData.subject}
                    onChange={handleUploadChange}
                    required
                  >
                    <option value="">Select Subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="History">History</option>
                    <option value="Art">Art</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Grade Level</label>
                  <select
                    name="gradeLevel"
                    value={uploadFormData.gradeLevel}
                    onChange={handleUploadChange}
                  >
                    <option value="">Select Grade</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Resource Type</label>
                  <select
                    name="resourceType"
                    value={uploadFormData.resourceType}
                    onChange={handleUploadChange}
                  >
                    <option value="">Select Type</option>
                    <option value="lesson_plan">Lesson Plan</option>
                    <option value="worksheet">Worksheet</option>
                    <option value="assessment">Assessment</option>
                    <option value="presentation">Presentation</option>
                    <option value="video">Video</option>
                    <option value="article">Article</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={!uploadFile}>
                  <FaUpload /> Upload Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resource Detail Modal */}
      {showDetailModal && selectedResource && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedResource.title}</h2>
              <button className="btn-close" onClick={() => setShowDetailModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="detail-content">
              <div className="detail-image">
                {selectedResource.thumbnail ? (
                  <img src={selectedResource.thumbnail} alt={selectedResource.title} />
                ) : (
                  <div className="placeholder">📄</div>
                )}
              </div>

              <div className="detail-info">
                <p className="detail-description">{selectedResource.description}</p>

                <div className="detail-meta">
                  <div className="meta-row">
                    <label>Subject:</label>
                    <span>{selectedResource.subject}</span>
                  </div>
                  <div className="meta-row">
                    <label>Grade Level:</label>
                    <span>{selectedResource.gradeLevel}</span>
                  </div>
                  <div className="meta-row">
                    <label>Type:</label>
                    <span>{selectedResource.resourceType}</span>
                  </div>
                  <div className="meta-row">
                    <label>Rating:</label>
                    <span className="rating-display">
                      <FaStar /> {selectedResource.rating?.averageRating?.toFixed(1) || '0.0'} ({selectedResource.rating?.ratingCount || 0} ratings)
                    </span>
                  </div>
                  <div className="meta-row">
                    <label>Downloads:</label>
                    <span>{selectedResource.downloads || 0}</span>
                  </div>
                </div>

                {selectedResource.isRemix && (
                  <div className="remix-info">
                    <span className="remix-badge">🔀 Remixed Resource</span>
                    <p>Based on: {selectedResource.remixedFromAuthor?.firstName}'s original</p>
                  </div>
                )}

                {/* Teacher Profile Card */}
                {selectedResource.createdBy && (
                  <div className="teacher-profile-card">
                    <div className="teacher-avatar">
                      {selectedResource.createdBy?.avatar ? (
                        <img src={selectedResource.createdBy.avatar} alt={selectedResource.createdBy?.firstName} />
                      ) : (
                        <div className="avatar-placeholder">👨‍🏫</div>
                      )}
                    </div>
                    <div className="teacher-info">
                      <h4>{selectedResource.createdBy?.firstName} {selectedResource.createdBy?.lastName}</h4>
                      <p className="teacher-role">{selectedResource.createdBy?.subject || 'Teacher'}</p>
                      <p className="teacher-bio">{selectedResource.createdBy?.bio || 'Sharing quality educational resources'}</p>
                      <button className="btn-visit-profile">View Profile</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <div className="reviews-header">
                <h3>Reviews ({selectedResource.rating?.ratingCount || 0})</h3>
                <button className="btn-add-review" onClick={() => setShowReviewForm(!showReviewForm)}>
                  ⭐ Write a Review
                </button>
              </div>

              {showReviewForm && (
                <form className="review-form" onSubmit={handleSubmitReview}>
                  <div className="star-rating">
                    <label>Your Rating:</label>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star-btn ${userRating >= star ? 'active' : ''}`}
                          onClick={() => setUserRating(star)}
                        >
                          <FaStar />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    placeholder="Share your thoughts about this resource..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows="3"
                  />
                  <div className="review-actions">
                    <button type="button" className="btn-secondary" onClick={() => setShowReviewForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      Submit Review
                    </button>
                  </div>
                </form>
              )}

              <div className="reviews-list">
                {selectedResource.reviews && selectedResource.reviews.length > 0 ? (
                  <>
                    {selectedResource.reviews.slice(0, showAllReviews ? undefined : 2).map((review, idx) => (
                      <div key={idx} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <span className="reviewer-name">{review.userId?.firstName || 'Anonymous'}</span>
                            <span className="review-date">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < review.rating ? 'filled' : 'empty'} />
                            ))}
                          </div>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                    ))}
                    {selectedResource.reviews.length > 2 && !showAllReviews && (
                      <button className="btn-show-more" onClick={() => setShowAllReviews(true)}>
                        Show All Reviews ({selectedResource.reviews.length})
                      </button>
                    )}
                  </>
                ) : (
                  <p className="no-reviews">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>

            {/* Related Resources */}
            {relatedResources.length > 0 && (
              <div className="related-resources-section">
                <h3>Related Resources in {selectedResource.subject}</h3>
                <div className="related-resources-grid">
                  {relatedResources.map((resource) => (
                    <div key={resource._id} className="related-resource-card">
                      <div className="related-image">
                        {resource.thumbnail ? (
                          <img src={resource.thumbnail} alt={resource.title} />
                        ) : (
                          <span>📄</span>
                        )}
                      </div>
                      <h4>{resource.title}</h4>
                      <p className="related-meta">{resource.gradeLevel}</p>
                      <button
                        className="btn-view-details"
                        onClick={() => {
                          setSelectedResource(resource);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => handleDownload(selectedResource._id)}
              >
                <FaDownload /> Download
              </button>
              <button
                className={`btn-heart-modal ${favorites.includes(selectedResource._id) ? 'favorited' : ''}`}
                onClick={() => handleFavorite(selectedResource._id)}
              >
                <FaHeart /> {favorites.includes(selectedResource._id) ? 'Favorited' : 'Favorite'}
              </button>
              <button
                className="btn-collections"
                onClick={() => setShowCollectionsModal(true)}
              >
                📁 Add to Collection
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setShowDetailModal(false);
                  setShowRemixModal(true);
                }}
              >
                <FaShare /> Remix This
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remix Modal */}
      {showRemixModal && selectedResource && (
        <div className="modal-overlay" onClick={() => setShowRemixModal(false)}>
          <div className="modal-content remix-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Remix Resource</h2>
              <button className="btn-close" onClick={() => setShowRemixModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleRemix}>
              <div className="remix-intro">
                <p>Create your improved version of: <strong>{selectedResource.title}</strong></p>
                <p className="remix-note">Your version will be linked to the original, and the author will be credited.</p>
              </div>

              <div className="form-group full">
                <label>Your Resource Title</label>
                <input
                  type="text"
                  defaultValue={`${selectedResource.title} (My Version)`}
                  placeholder="Give your remix a title"
                />
              </div>

              <div className="form-group full">
                <label>What improvements are you making?</label>
                <textarea
                  placeholder="Describe the changes or improvements you're making..."
                  rows="4"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowRemixModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <FaShare /> Create Remix
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collections Modal */}
      {showCollectionsModal && selectedResource && (
        <div className="modal-overlay" onClick={() => setShowCollectionsModal(false)}>
          <div className="modal-content collections-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add to Collection</h2>
              <button className="btn-close" onClick={() => setShowCollectionsModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="collections-content">
              {collections && collections.length > 0 ? (
                <div className="collections-grid">
                  {collections.map((collection) => (
                    <div key={collection._id} className="collection-option">
                      <div className="collection-header">
                        <h4>{collection.name}</h4>
                        <span className="item-count">{collection.resources?.length || 0} items</span>
                      </div>
                      <p className="collection-description">{collection.description}</p>
                      <button
                        className="btn-add-to-collection"
                        onClick={() => {
                          handleAddToCollection(collection._id);
                          setShowCollectionsModal(false);
                        }}
                      >
                        Add to This Collection
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-collections">
                  <p>You don't have any collections yet.</p>
                  <a href="/dashboard" className="btn-create-collection">
                    Create Your First Collection
                  </a>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowCollectionsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;
