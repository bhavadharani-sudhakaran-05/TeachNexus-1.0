import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { lessonPlanAPI, aiToolsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import '../styles/lesson-planner.css';

const LessonPlannerPage = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    gradeLevel: '',
    duration: '',
    objectives: [''],
    materials: [''],
  });
  const [aiGenerated, setAiGenerated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const prefill = location.state?.prefill;
    if (!prefill) return;

    setFormData((prev) => ({
      ...prev,
      ...prefill.formData,
      objectives: prefill.formData?.objectives?.length ? prefill.formData.objectives : prev.objectives,
      materials: prefill.formData?.materials?.length ? prefill.formData.materials : prev.materials,
    }));

    if (prefill.aiGenerated) {
      setAiGenerated(prefill.aiGenerated);
    }

    toast.success('AI output loaded into Lesson Planner.');
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const generateWithAI = async () => {
    if (!formData.title || !formData.gradeLevel) {
      toast.error('Please fill in topic and grade level');
      return;
    }

    setIsLoading(true);
    try {
      const response = await aiToolsAPI.generateLessonPlan({
        topic: formData.title,
        gradeLevel: formData.gradeLevel,
        duration: formData.duration,
      });

      setAiGenerated(response.data.lessonPlan);
      toast.success('Lesson plan generated with AI!');
    } catch (error) {
      toast.error('Failed to generate lesson plan');
    } finally {
      setIsLoading(false);
    }
  };

  const saveLessonPlan = async () => {
    try {
      await lessonPlanAPI.createLessonPlan({
        ...formData,
        ...aiGenerated,
      });
      toast.success('Lesson plan saved successfully!');
      setFormData({
        title: '',
        subject: '',
        gradeLevel: '',
        duration: '',
        objectives: [''],
        materials: [''],
      });
      setAiGenerated(null);
    } catch (error) {
      toast.error('Failed to save lesson plan');
    }
  };

  return (
    <div className="lesson-planner">
      <div className="container">
        <h1>📝 Lesson Planner</h1>

        <div className="planner-layout">
          {/* Form Section */}
          <div className="planner-form">
            <div className="form-group">
              <label>Lesson Topic</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Introduction to Photosynthesis"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Subject</label>
                <select name="subject" value={formData.subject} onChange={handleInputChange}>
                  <option value="">Select Subject</option>
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                </select>
              </div>

              <div className="form-group">
                <label>Grade Level</label>
                <select name="gradeLevel" value={formData.gradeLevel} onChange={handleInputChange}>
                  <option value="">Select Grade</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>

              <div className="form-group">
                <label>Duration (mins)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="45"
                />
              </div>
            </div>

            <div className="generate-sticky">
              <button className="btn btn-primary" onClick={generateWithAI} disabled={isLoading}>
                ✨ {isLoading ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>
          </div>

          {/* Preview Section */}
          {aiGenerated && (
            <div className="planner-preview">
              <h2>🤖 AI-Generated Content</h2>
              <div className="preview-content">
                <h3>Objectives</h3>
                <ul>
                  {aiGenerated.objectives?.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>

                <h3>Materials</h3>
                <ul>
                  {aiGenerated.materials?.map((material, i) => (
                    <li key={i}>{material}</li>
                  ))}
                </ul>

                <h3>Introduction</h3>
                <p>{aiGenerated.introduction}</p>

                <button className="btn btn-primary" onClick={saveLessonPlan}>
                  💾 Save Lesson Plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPlannerPage;
