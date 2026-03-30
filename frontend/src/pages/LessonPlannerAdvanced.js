import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { lessonPlanAPI, aiToolsAPI, resourceAPI } from '../utils/api';
import toast from 'react-hot-toast';
import '../styles/lesson-planner-advanced.css';

const LessonPlannerAdvanced = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State Management
  const [activeTab, setActiveTab] = useState('editor'); // editor, calendar, templates
  const [lessonData, setLessonData] = useState({
    title: '',
    subject: '',
    gradeLevel: '',
    duration: 45,
    objectives: [''],
    materials: [''],
    prerequisites: [''],
    introduction: '',
    instructionalStrategies: '',
    studentActivities: '',
    closure: '',
    assessment: '',
    accommodations: '',
    linkedResources: [],
    scheduledDate: new Date().toISOString().split('T')[0],
    isPublic: false,
    isDraft: true,
  });

  const [lessons, setLessons] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResourcePicker, setShowResourcePicker] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Fetch lessons and resources on mount
  useEffect(() => {
    fetchLessons();
    fetchResources();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await lessonPlanAPI.getLessonPlans();
      setLessons(response.data.lessonPlans || []);
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    }
  };

  const fetchResources = async () => {
    try {
      const response = await resourceAPI.getResources({ limit: 100 });
      setResources(response.data.resources || []);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    }
  };

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLessonData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (index, field, value) => {
    setLessonData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setLessonData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    setLessonData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // AI Generation
  const generateWithAI = async () => {
    if (!lessonData.title || !lessonData.gradeLevel) {
      toast.error('Please fill in topic and grade level');
      return;
    }

    setIsLoading(true);
    try {
      const response = await aiToolsAPI.generateLessonPlan({
        topic: lessonData.title,
        gradeLevel: lessonData.gradeLevel,
        duration: lessonData.duration,
      });

      setLessonData(prev => ({
        ...prev,
        introduction: response.data.lessonPlan.introduction || prev.introduction,
        instructionalStrategies: response.data.lessonPlan.instructionalStrategies || prev.instructionalStrategies,
        studentActivities: response.data.lessonPlan.studentActivities || prev.studentActivities,
        closure: response.data.lessonPlan.closure || prev.closure,
        assessment: response.data.lessonPlan.assessment || prev.assessment,
        accommodations: response.data.lessonPlan.accommodations || prev.accommodations,
      }));

      toast.success('Lesson plan content generated with AI!');
    } catch (error) {
      toast.error('Failed to generate with AI');
    } finally {
      setIsLoading(false);
    }
  };

  // Save lesson
  const saveLessonPlan = async (asDraft = true) => {
    if (!lessonData.title) {
      toast.error('Please enter a lesson title');
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        ...lessonData,
        isDraft: asDraft,
      };

      if (selectedLesson) {
        await lessonPlanAPI.updateLessonPlan(selectedLesson._id, payload);
        toast.success('Lesson updated successfully!');
      } else {
        await lessonPlanAPI.createLessonPlan(payload);
        toast.success('Lesson saved successfully!');
        resetForm();
        fetchLessons();
      }
    } catch (error) {
      toast.error('Failed to save lesson plan');
    } finally {
      setIsLoading(false);
    }
  };

  // Publish lesson
  const publishLessonPlan = async () => {
    await saveLessonPlan(false);
    setShowPublishModal(false);
  };

  // Load lesson for editing
  const editLesson = (lesson) => {
    setSelectedLesson(lesson);
    setLessonData(lesson);
    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete lesson
  const deleteLesson = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;

    try {
      await lessonPlanAPI.deleteLessonPlan(lessonId);
      toast.success('Lesson deleted');
      fetchLessons();
      resetForm();
    } catch (error) {
      toast.error('Failed to delete lesson');
    }
  };

  // Link resource
  const linkResource = (resourceId) => {
    if (!lessonData.linkedResources.includes(resourceId)) {
      setLessonData(prev => ({
        ...prev,
        linkedResources: [...prev.linkedResources, resourceId]
      }));
      toast.success('Resource linked!');
    }
    setShowResourcePicker(false);
  };

  // Remove linked resource
  const unlinkResource = (resourceId) => {
    setLessonData(prev => ({
      ...prev,
      linkedResources: prev.linkedResources.filter(id => id !== resourceId)
    }));
  };

  const resetForm = () => {
    setLessonData({
      title: '',
      subject: '',
      gradeLevel: '',
      duration: 45,
      objectives: [''],
      materials: [''],
      prerequisites: [''],
      introduction: '',
      instructionalStrategies: '',
      studentActivities: '',
      closure: '',
      assessment: '',
      accommodations: '',
      linkedResources: [],
      scheduledDate: new Date().toISOString().split('T')[0],
      isPublic: false,
      isDraft: true,
    });
    setSelectedLesson(null);
  };

  return (
    <div className="lesson-planner-advanced">
      {/* Header */}
      <div className="lpa-header">
        <div className="lpa-container">
          <div>
            <h1>📚 Advanced Lesson Planner</h1>
            <p>Create, collaborate, and publish professional lesson plans</p>
          </div>
          <div className="lpa-stats">
            <div className="stat-item">
              <span className="stat-label">Total Lessons</span>
              <span className="stat-value">{lessons.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Published</span>
              <span className="stat-value">{lessons.filter(l => !l.isDraft).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="lpa-tabs">
        <button
          className={`lpa-tab ${activeTab === 'editor' ? 'active' : ''}`}
          onClick={() => setActiveTab('editor')}
        >
          ✏️ Editor
        </button>
        <button
          className={`lpa-tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          📅 Calendar
        </button>
        <button
          className={`lpa-tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          📋 Templates
        </button>
      </div>

      <div className="lpa-container">
        {/* EDITOR TAB */}
        {activeTab === 'editor' && (
          <div className="lpa-editor">
            {/* Form Section */}
            <div className="lpa-form-section">
              <div className="lpa-form-header">
                <h2>{selectedLesson ? '✏️ Edit Lesson' : '➕ Create New Lesson'}</h2>
                {selectedLesson && (
                  <button className="btn-text" onClick={resetForm}>New Lesson</button>
                )}
              </div>

              {/* Basic Info */}
              <div className="form-card">
                <h3>📝 Basic Information</h3>
                <div className="form-layout">
                  <div className="form-full">
                    <label>Lesson Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={lessonData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Introduction to Photosynthesis"
                      className="form-input"
                    />
                  </div>

                  <div className="form-grid-3">
                    <div>
                      <label>Subject *</label>
                      <select name="subject" value={lessonData.subject} onChange={handleInputChange} className="form-input">
                        <option value="">Select Subject</option>
                        <option value="Science">Science</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="English">English</option>
                        <option value="History">History</option>
                        <option value="Art">Art</option>
                        <option value="PE">Physical Education</option>
                      </select>
                    </div>
                    <div>
                      <label>Grade Level *</label>
                      <select name="gradeLevel" value={lessonData.gradeLevel} onChange={handleInputChange} className="form-input">
                        <option value="">Select Grade</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                      </select>
                    </div>
                    <div>
                      <label>Duration (minutes)</label>
                      <input
                        type="number"
                        name="duration"
                        value={lessonData.duration}
                        onChange={handleInputChange}
                        min="5"
                        max="480"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div>
                      <label>Scheduled Date</label>
                      <input
                        type="date"
                        name="scheduledDate"
                        value={lessonData.scheduledDate}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div className="checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          name="isPublic"
                          checked={lessonData.isPublic}
                          onChange={handleInputChange}
                        />
                        <span>Make Public</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Objectives & Prerequisites */}
              <div className="form-card">
                <h3>🎯 Learning Objectives</h3>
                {lessonData.objectives.map((obj, index) => (
                  <div key={index} className="form-array-item">
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => handleArrayChange(index, 'objectives', e.target.value)}
                      placeholder="e.g., Students will understand the process of photosynthesis"
                      className="form-input"
                    />
                    {lessonData.objectives.length > 1 && (
                      <button className="btn-remove" onClick={() => removeArrayItem(index, 'objectives')}>×</button>
                    )}
                  </div>
                ))}
                <button className="btn-secondary-small" onClick={() => addArrayItem('objectives')}>+ Add Objective</button>
              </div>

              {/* Materials */}
              <div className="form-card">
                <h3>📦 Materials & Resources</h3>
                {lessonData.materials.map((material, index) => (
                  <div key={index} className="form-array-item">
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => handleArrayChange(index, 'materials', e.target.value)}
                      placeholder="e.g., Projector, slides, microscope"
                      className="form-input"
                    />
                    {lessonData.materials.length > 1 && (
                      <button className="btn-remove" onClick={() => removeArrayItem(index, 'materials')}>×</button>
                    )}
                  </div>
                ))}
                <button className="btn-secondary-small" onClick={() => addArrayItem('materials')}>+ Add Material</button>
              </div>

              {/* Content Sections */}
              <div className="form-card">
                <h3>📄 Lesson Content</h3>

                <div className="ai-generate-banner">
                  <span>💡 Let AI generate content for you</span>
                  <button
                    className="btn btn-accent"
                    onClick={generateWithAI}
                    disabled={isLoading || !lessonData.title || !lessonData.gradeLevel}
                  >
                    {isLoading ? '⏳ Generating...' : '✨ Generate with AI'}
                  </button>
                </div>

                <div className="form-section-textarea">
                  <label>Introduction</label>
                  <textarea
                    name="introduction"
                    value={lessonData.introduction}
                    onChange={handleInputChange}
                    placeholder="Hook the students and introduce the topic"
                    rows="3"
                    className="form-textarea"
                  />
                </div>

                <div className="form-section-textarea">
                  <label>Instructional Strategies</label>
                  <textarea
                    name="instructionalStrategies"
                    value={lessonData.instructionalStrategies}
                    onChange={handleInputChange}
                    placeholder="How will you teach the content?"
                    rows="3"
                    className="form-textarea"
                  />
                </div>

                <div className="form-section-textarea">
                  <label>Student Activities</label>
                  <textarea
                    name="studentActivities"
                    value={lessonData.studentActivities}
                    onChange={handleInputChange}
                    placeholder="What will students do during the lesson?"
                    rows="3"
                    className="form-textarea"
                  />
                </div>

                <div className="form-section-textarea">
                  <label>Assessment</label>
                  <textarea
                    name="assessment"
                    value={lessonData.assessment}
                    onChange={handleInputChange}
                    placeholder="How will you assess student learning?"
                    rows="2"
                    className="form-textarea"
                  />
                </div>

                <div className="form-section-textarea">
                  <label>Closure</label>
                  <textarea
                    name="closure"
                    value={lessonData.closure}
                    onChange={handleInputChange}
                    placeholder="How will you wrap up and summarize the lesson?"
                    rows="2"
                    className="form-textarea"
                  />
                </div>

                <div className="form-section-textarea">
                  <label>Accommodations & Modifications</label>
                  <textarea
                    name="accommodations"
                    value={lessonData.accommodations}
                    onChange={handleInputChange}
                    placeholder="How will you accommodate different learning styles?"
                    rows="2"
                    className="form-textarea"
                  />
                </div>
              </div>

              {/* Linked Resources */}
              <div className="form-card">
                <h3>🔗 Linked Resources</h3>
                {lessonData.linkedResources.length > 0 && (
                  <div className="linked-resources">
                    {lessonData.linkedResources.map(resourceId => {
                      const resource = resources.find(r => r._id === resourceId);
                      return resource ? (
                        <div key={resourceId} className="linked-resource-item">
                          <div>
                            <h4>{resource.title}</h4>
                            <p>{resource.type}</p>
                          </div>
                          <button className="btn-remove" onClick={() => unlinkResource(resourceId)}>Remove</button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
                <button className="btn-secondary" onClick={() => setShowResourcePicker(!showResourcePicker)}>
                  + Link Resource
                </button>
              </div>

              {/* Resource Picker */}
              {showResourcePicker && (
                <div className="resource-picker">
                  <h3>Select Resources to Link</h3>
                  <div className="resource-grid">
                    {resources.map(resource => (
                      <div key={resource._id} className="resource-item-picker">
                        <h4>{resource.title}</h4>
                        <p>{resource.type}</p>
                        <button
                          className="btn-small"
                          onClick={() => linkResource(resource._id)}
                        >
                          Link
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="lpa-actions">
              <button className="btn btn-secondary" onClick={() => saveLessonPlan(true)} disabled={isLoading}>
                💾 Save as Draft
              </button>
              <button className="btn btn-primary" onClick={() => setShowPublishModal(true)} disabled={isLoading}>
                🚀 Publish
              </button>
              {selectedLesson && (
                <button className="btn btn-danger" onClick={() => deleteLesson(selectedLesson._id)} disabled={isLoading}>
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div className="lpa-calendar">
            <h2>📅 Lesson Calendar</h2>
            <div className="calendar-grid">
              {lessons.filter(l => l.scheduledDate).map(lesson => (
                <div key={lesson._id} className="calendar-card">
                  <div className="calendar-date">
                    {new Date(lesson.scheduledDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <h4>{lesson.title}</h4>
                  <p className="lesson-subject">{lesson.subject}</p>
                  <p className="lesson-grade">{lesson.gradeLevel}</p>
                  <div className="card-badges">
                    {!lesson.isDraft && <span className="badge-published">Published</span>}
                    {lesson.isDraft && <span className="badge-draft">Draft</span>}
                  </div>
                  <button
                    className="btn-text"
                    onClick={() => editLesson(lesson)}
                  >
                    Edit →
                  </button>
                </div>
              ))}
            </div>
            {lessons.length === 0 && (
              <div className="empty-state">
                <p>No lessons scheduled yet</p>
                <button className="btn btn-primary" onClick={() => setActiveTab('editor')}>
                  Create First Lesson
                </button>
              </div>
            )}
          </div>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div className="lpa-templates">
            <h2>📋 Lesson Templates</h2>
            <div className="template-grid">
              {[
                { name: '5E Learning Cycle', desc: 'Engage, Explore, Explain, Elaborate, Evaluate' },
                { name: 'Direct Instruction', desc: 'I Do, We Do, You Do' },
                { name: 'Project-Based Learning', desc: 'Question, Plan, Investigate, Create, Share' },
                { name: 'Cooperative Learning', desc: 'Structured group activities with roles' },
                { name: 'Inquiry-Based', desc: 'Student-centered discovery learning' },
                { name: 'Flipped Classroom', desc: 'Home prep + class practice' },
              ].map((template, i) => (
                <div key={i} className="template-card">
                  <h3>{template.name}</h3>
                  <p>{template.desc}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setLessonData(prev => ({ ...prev, title: template.name }));
                      setActiveTab('editor');
                    }}
                  >
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="modal-overlay" onClick={() => setShowPublishModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>🚀 Publish Lesson</h2>
            <p>Make this lesson available to other teachers in the community?</p>
            <div className="modal-checkboxes">
              <label>
                <input
                  type="checkbox"
                  checked={lessonData.isPublic}
                  onChange={(e) => setLessonData(prev => ({ ...prev, isPublic: e.target.checked }))}
                />
                <span>Make visible to other teachers</span>
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowPublishModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={publishLessonPlan} disabled={isLoading}>
                {isLoading ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPlannerAdvanced;