import React, { useEffect, useMemo, useState } from 'react';
import { aiToolsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import '../styles/ai-tools.css';

const AIToolsPage = () => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formValues, setFormValues] = useState({
    topic: '',
    gradeLevel: '',
    duration: '',
    resourceContent: '',
    voiceNote: '',
    whiteboardNotes: '',
    className: '',
    studentData: '',
    subject: '',
    gapGradeLevel: '',
  });

  const tools = [
    {
      id: 'lesson-planner',
      name: 'AI Lesson Planner',
      description: 'Generate complete lesson plans in seconds',
      icon: '📝',
    },
    {
      id: 'resource-summarizer',
      name: 'Resource Summarizer',
      description: 'Get key points from any teaching material',
      icon: '📚',
    },
    {
      id: 'voice-converter',
      name: 'Voice to Lesson Plan',
      description: 'Convert your voice notes into lesson plans',
      icon: '🎤',
    },
    {
      id: 'whiteboard-scanner',
      name: 'Whiteboard Scanner',
      description: 'Digitalize and organize whiteboard content',
      icon: '✏️',
    },
    {
      id: 'student-predictor',
      name: 'Student Performance Predictor',
      description: 'Identify at-risk students early',
      icon: '📊',
    },
    {
      id: 'gap-analyzer',
      name: 'Resource Gap Analyzer',
      description: 'Find critical gaps in available resources',
      icon: '🎯',
    },
  ];

  const selectedToolDetails = useMemo(
    () => tools.find((tool) => tool.id === selectedTool),
    [selectedTool]
  );

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedTool(null);
        setResult(null);
      }
    };

    if (selectedTool) {
      window.addEventListener('keydown', closeOnEscape);
    }

    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedTool]);

  const openTool = (toolId) => {
    setSelectedTool(toolId);
    setResult(null);
  };

  const closeTool = () => {
    setSelectedTool(null);
    setResult(null);
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const parseStudentData = (rawText) => {
    if (!rawText.trim()) return [];

    return rawText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [studentName, scoresRaw = '', attendanceRaw = '', participation = 'medium'] = line
          .split('|')
          .map((item) => item.trim());

        const recentScores = scoresRaw
          .split(',')
          .map((score) => Number(score.trim()))
          .filter((score) => !Number.isNaN(score));

        const attendancePercentage = Number(attendanceRaw);

        return {
          studentName,
          recentScores,
          attendancePercentage: Number.isNaN(attendancePercentage) ? 0 : attendancePercentage,
          participationLevel: ['low', 'medium', 'high'].includes(participation) ? participation : 'medium',
          behaviorNotes: 'Generated from teacher quick input',
        };
      })
      .filter((student) => student.studentName);
  };

  const executeTool = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      let response;

      switch (selectedTool) {
        case 'lesson-planner':
          response = await aiToolsAPI.generateLessonPlan({
            topic: formValues.topic,
            gradeLevel: formValues.gradeLevel,
            duration: formValues.duration,
          });
          break;
        case 'resource-summarizer':
          response = await aiToolsAPI.summarizeResource({
            resourceContent: formValues.resourceContent,
          });
          break;
        case 'voice-converter':
          response = await aiToolsAPI.voiceToLessonPlan({
            transcript: formValues.voiceNote,
          });
          break;
        case 'whiteboard-scanner':
          response = await aiToolsAPI.scanWhiteboard({
            notes: formValues.whiteboardNotes,
          });
          break;
        case 'student-predictor': {
          const studentData = parseStudentData(formValues.studentData);
          response = await aiToolsAPI.predictStudentPerformance({
            className: formValues.className,
            studentData,
          });
          break;
        }
        case 'gap-analyzer':
          response = await aiToolsAPI.analyzeResourceGaps({
            subject: formValues.subject,
            gradeLevel: formValues.gapGradeLevel,
          });
          break;
        default:
          toast.error('Tool is not configured yet.');
          return;
      }

      setResult(response.data);
      toast.success('AI tool completed successfully.');
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong while running the tool.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderToolForm = () => {
    switch (selectedTool) {
      case 'lesson-planner':
        return (
          <>
            <label htmlFor="topic">Topic</label>
            <input id="topic" name="topic" value={formValues.topic} onChange={onChange} required />

            <label htmlFor="gradeLevel">Grade Level</label>
            <input id="gradeLevel" name="gradeLevel" value={formValues.gradeLevel} onChange={onChange} required />

            <label htmlFor="duration">Duration</label>
            <input id="duration" name="duration" value={formValues.duration} onChange={onChange} placeholder="45 minutes" required />
          </>
        );
      case 'resource-summarizer':
        return (
          <>
            <label htmlFor="resourceContent">Resource Content</label>
            <textarea
              id="resourceContent"
              name="resourceContent"
              value={formValues.resourceContent}
              onChange={onChange}
              placeholder="Paste text from lesson notes or a resource"
              required
            />
          </>
        );
      case 'voice-converter':
        return (
          <>
            <label htmlFor="voiceNote">Voice Transcript</label>
            <textarea
              id="voiceNote"
              name="voiceNote"
              value={formValues.voiceNote}
              onChange={onChange}
              placeholder="Paste your transcribed voice notes here"
              required
            />
          </>
        );
      case 'whiteboard-scanner':
        return (
          <>
            <label htmlFor="whiteboardNotes">Whiteboard Notes</label>
            <textarea
              id="whiteboardNotes"
              name="whiteboardNotes"
              value={formValues.whiteboardNotes}
              onChange={onChange}
              placeholder="Describe what is on the board"
              required
            />
          </>
        );
      case 'student-predictor':
        return (
          <>
            <label htmlFor="className">Class Name</label>
            <input id="className" name="className" value={formValues.className} onChange={onChange} required />

            <label htmlFor="studentData">Student Data</label>
            <textarea
              id="studentData"
              name="studentData"
              value={formValues.studentData}
              onChange={onChange}
              placeholder="Format: Name|80,74,66|92|medium (one student per line)"
              required
            />
          </>
        );
      case 'gap-analyzer':
        return (
          <>
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" value={formValues.subject} onChange={onChange} required />

            <label htmlFor="gapGradeLevel">Grade Level</label>
            <input
              id="gapGradeLevel"
              name="gapGradeLevel"
              value={formValues.gapGradeLevel}
              onChange={onChange}
              placeholder="Grade 9"
              required
            />
          </>
        );
      default:
        return <p>Select a tool to get started.</p>;
    }
  };

  const renderResult = () => {
    if (!result) {
      return <p className="result-placeholder">Run the tool to see output here.</p>;
    }

    return (
      <div className="result-panel">
        <h3>Output</h3>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="ai-tools-page">
      <div className="container">
        <h1>🤖 AI-Powered Tools</h1>
        <p className="subtitle">Transform your teaching with intelligent assistance</p>

        <div className="tools-grid">
          {tools.map((tool) => (
            <div key={tool.id} className="tool-card">
              <div className="tool-icon">{tool.icon}</div>
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
              <button
                className="btn btn-primary"
                onClick={() => openTool(tool.id)}
              >
                Try Now
              </button>
            </div>
          ))}
        </div>

        {/* Tool Interface */}
        {selectedTool && (
          <div className="tool-interface" onClick={closeTool}>
            <div className="tool-content" onClick={(event) => event.stopPropagation()}>
              <button className="close-btn" onClick={closeTool}>✕</button>
              <h2>{selectedToolDetails?.name}</h2>
              <p>{selectedToolDetails?.description}</p>

              <div className="tool-workspace">
                <form className="tool-form" onSubmit={executeTool}>
                  {renderToolForm()}
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Working...' : 'Generate'}
                  </button>
                </form>

                {renderResult()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIToolsPage;
