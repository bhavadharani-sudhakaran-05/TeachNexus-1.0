import React, { useState, useEffect } from 'react';
import { resourceAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { FaSearch, FaThLarge, FaList } from 'react-icons/fa';
import '../styles/resources.css';

const ResourceLibrary = () => {
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({ subject: '', gradeLevel: '', search: '' });
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadResources();
  }, [filters]);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const response = await resourceAPI.getResources(filters);
      setResources(response.data.resources);
    } catch (error) {
      toast.error('Failed to load resources');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="resource-library">
      <div className="container">
        <h1>📚 Resource Library</h1>

        {/* Search & Filters */}
        <div className="search-section">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search resources..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          <div className="filters">
            <select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            >
              <option value="">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="History">History</option>
            </select>

            <select
              value={filters.gradeLevel}
              onChange={(e) => setFilters({ ...filters, gradeLevel: e.target.value })}
            >
              <option value="">All Grades</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
          </div>

          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <FaThLarge />
            </button>
            <button
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <FaList />
            </button>
          </div>
        </div>

        {/* Resources Grid/List */}
        <div className={`resources-${viewMode}`}>
          {isLoading ? (
            <div className="loading">Loading resources...</div>
          ) : resources.length > 0 ? (
            resources.map((resource) => (
              <div key={resource._id} className="resource-card">
                <div className="resource-header">
                  <h3>{resource.title}</h3>
                  <span className="resource-type">{resource.resourceType}</span>
                </div>
                <p className="resource-desc">{resource.description}</p>
                <div className="resource-footer">
                  <span>{resource.subject}</span>
                  <div className="resource-stats">
                    <span>⬇️ {resource.downloads}</span>
                    <span>⭐ {resource.rating?.averageRating?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No resources found. Try adjusting your filters.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceLibrary;
