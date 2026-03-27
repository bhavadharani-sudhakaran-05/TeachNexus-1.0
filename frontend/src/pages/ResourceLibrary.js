import React, { useState, useEffect } from 'react';
import { resourceAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FaSearch, FaThLarge, FaList, FaUpload, FaStar, FaDownload } from 'react-icons/fa';
import '../styles/resources.css';

const ResourceLibrary = () => {
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({ subject: '', gradeLevel: '', search: '' });
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadResources();
  }, [filters, sortBy]);

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
            <button className="btn-upload">
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
                      <button className="btn-download">Download</button>
                      <button className="btn-preview">Preview</button>
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
            <button className="btn-upload-cta">
              <FaUpload /> Upload Your First Resource
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceLibrary;
