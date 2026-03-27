import React, { useState, useEffect } from 'react';
import { FaCalendar, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaAI } from 'react-icons/fa';
import '../styles/lessonplanner.css';

const LessonPlanner = () => {
  const [lessons, setLessons] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    gradeLevel: '',
    duration: '45',
    objectives: '',
    materials: '',
    date: '',
    time: '',
  });

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDay = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDaysArray = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDayOfMonth = firstDay(currentMonth);

    // Empty cells before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }

    return days;
  };

  const handleCreateLesson = () => {
    if (formData.title && formData.date) {
      const newLesson = {
        id: Date.now(),
        ...formData,
      };
      setLessons([...lessons, newLesson]);
      setFormData({
        title: '',
        description: '',
        subject: '',
        gradeLevel: '',
        duration: '45',
        objectives: '',
        materials: '',
        date: '',
        time: '',
      });
      setShowModal(false);
    }
  };

  const handleDeleteLesson = (id) => {
    setLessons(lessons.filter((lesson) => lesson.id !== id));
  };

  const getLessonsForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return lessons.filter((lesson) => lesson.date === dateStr);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysArray = getDaysArray();
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterSubject || lesson.subject === filterSubject;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="lesson-planner-page">
      <div className="planner-container">
        {/* Header */}
        <div className="planner-header">
          <h1>📅 Lesson Planner</h1>
          <p>Create and manage your lesson plans with AI assistance</p>
        </div>

        {/* Controls */}
        <div className="planner-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="view-options">
            <button
              className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
            <button
              className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
            <button
              className={`view-btn ${viewMode === 'day' ? 'active' : ''}`}
              onClick={() => setViewMode('day')}
            >
              Day
            </button>
          </div>

          <button className="btn-create" onClick={() => setShowModal(true)}>
            <FaPlus /> New Lesson
          </button>
        </div>

        <div className="planner-content">
          {/* Calendar Sidebar */}
          <div className="calendar-sidebar">
            <div className="calendar-header">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                ←
              </button>
              <h3>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                →
              </button>
            </div>

            <div className="calendar-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="calendar-day-header">
                  {day}
                </div>
              ))}
              {daysArray.map((day, idx) => (
                <div
                  key={idx}
                  className={`calendar-day ${day ? 'active' : ''} ${
                    selectedDate === day ? 'selected' : ''
                  } ${getLessonsForDate(day).length > 0 ? 'has-lessons' : ''}`}
                  onClick={() => day && setSelectedDate(day)}
                >
                  {day && (
                    <>
                      <span className="day-number">{day}</span>
                      {getLessonsForDate(day).length > 0 && (
                        <span className="lesson-indicator">●</span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="calendar-filter">
              <FaFilter className="filter-icon" />
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="History">History</option>
              </select>
            </div>
          </div>

          {/* Main Content */}
          <div className="planner-main">
            {viewMode === 'month' && (
              <div className="month-view">
                <h2>{monthNames[currentMonth.getMonth()]} Overview</h2>
                <div className="lessons-list">
                  {filteredLessons.length > 0 ? (
                    filteredLessons.map((lesson) => (
                      <div key={lesson.id} className="lesson-card">
                        <div className="lesson-card-header">
                          <h3>{lesson.title}</h3>
                          <span className="subject-badge">{lesson.subject}</span>
                        </div>
                        <p className="lesson-desc">{lesson.description}</p>
                        <div className="lesson-meta">
                          <span>📅 {lesson.date}</span>
                          <span>⏱️ {lesson.duration} min</span>
                          <span>🎓 {lesson.gradeLevel}</span>
                        </div>
                        <div className="lesson-actions">
                          <button className="btn-edit">
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteLesson(lesson.id)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">📚</div>
                      <p>No lessons planned yet. Create your first lesson!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {viewMode === 'week' && (
              <div className="week-view">
                <h2>Weekly View</h2>
                <p className="coming-soon">Week view coming soon...</p>
              </div>
            )}

            {viewMode === 'day' && (
              <div className="day-view">
                <h2>Daily Schedule</h2>
                <p className="coming-soon">Day view coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Lesson</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form
              className="lesson-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateLesson();
              }}
            >
              <div className="form-group">
                <label>Lesson Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Introduction to Algebra"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="">Select...</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="History">History</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Grade Level</label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                  >
                    <option value="">Select...</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Duration (mins)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Describe the lesson..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label>Learning Objectives</label>
                <textarea
                  placeholder="What will students learn?"
                  value={formData.objectives}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                  rows="2"
                ></textarea>
              </div>

              <div className="form-group">
                <label>Materials Needed</label>
                <textarea
                  placeholder="List any materials or resources..."
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  rows="2"
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  <FaPlus /> Create Lesson
                </button>
                <button type="button" className="btn-ai">
                  <FaAI /> Generate with AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPlanner;
