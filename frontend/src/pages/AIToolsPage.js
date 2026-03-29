import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiToolsAPI } from '../utils/api';
import toast from 'react-hot-toast';
import '../styles/ai-tools.css';

const TOOL_CONFIG = [
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

const EXAMPLES = {
  'lesson-planner': {
    topic: 'Introduction to Photosynthesis',
    gradeLevel: 'Grade 9',
    duration: '45 minutes',
  },
  'resource-summarizer': {
    resourceContent:
      'Photosynthesis is the process by which green plants convert light energy into chemical energy. Chlorophyll captures sunlight in chloroplasts. Carbon dioxide and water are used to produce glucose and oxygen. Light-dependent reactions occur in the thylakoid membranes, while the Calvin cycle happens in the stroma.',
  },
  'voice-converter': {
    voiceNote:
      'Today I want students to explain how photosynthesis works, compare chloroplast structure and function, and complete a concept map in groups. We will start with a quick warm-up question and end with an exit ticket.',
  },
  'whiteboard-scanner': {
    whiteboardNotes:
      'Topic: Ecosystems\n- Producers, consumers, decomposers\n- Food chains and food webs\n- Energy pyramid\nHomework: Draw a food web from your local environment.',
  },
  'student-predictor': {
    className: 'Grade 10 Science A',
    studentData:
      'Aisha|78,80,84|95|high\nNoah|52,49,55|72|low\nPriya|68,70,66|88|medium',
  },
  'gap-analyzer': {
    subject: 'Science',
    gapGradeLevel: 'Grade 10',
  },
};

const AIToolsPage = () => {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [lastRunAt, setLastRunAt] = useState(null);
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

  const selectedToolDetails = useMemo(
    () => TOOL_CONFIG.find((tool) => tool.id === selectedTool),
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
    setLastRunAt(null);
  };

  const closeTool = () => {
    setSelectedTool(null);
    setResult(null);
    setLastRunAt(null);
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyExampleInput = () => {
    const exampleData = EXAMPLES[selectedTool];
    if (!exampleData) return;

    setFormValues((prev) => ({
      ...prev,
      ...exampleData,
    }));
    toast.success('Example data applied.');
  };

  const resetCurrentTool = () => {
    setResult(null);
    setLastRunAt(null);
    toast.success('Output cleared.');
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

  const validateBeforeRun = () => {
    if (!selectedTool) return false;

    const requiredByTool = {
      'lesson-planner': ['topic', 'gradeLevel', 'duration'],
      'resource-summarizer': ['resourceContent'],
      'voice-converter': ['voiceNote'],
      'whiteboard-scanner': ['whiteboardNotes'],
      'student-predictor': ['className', 'studentData'],
      'gap-analyzer': ['subject', 'gapGradeLevel'],
    };

    const missing = (requiredByTool[selectedTool] || []).filter((key) => !String(formValues[key] || '').trim());

    if (missing.length) {
      toast.error('Please complete all required fields before running this tool.');
      return false;
    }

    if (selectedTool === 'student-predictor') {
      const parsed = parseStudentData(formValues.studentData);
      if (!parsed.length) {
        toast.error('Student data format is invalid. Use Name|80,70,60|90|medium per line.');
        return false;
      }
    }

    return true;
  };

  const executeTool = async (event) => {
    event.preventDefault();
    if (!validateBeforeRun()) return;

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
      setLastRunAt(new Date());
      toast.success('AI tool completed successfully.');
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong while running the tool.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyResult = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      toast.success('Output copied to clipboard.');
    } catch {
      toast.error('Unable to copy output.');
    }
  };

  const downloadResult = () => {
    if (!result || !selectedTool) return;

    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedTool}-output.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const sendToLessonPlanner = () => {
    if (selectedTool !== 'lesson-planner' || !result?.lessonPlan) return;

    const durationMatch = String(formValues.duration || '').match(/\d+/);
    const normalizedDuration = durationMatch ? durationMatch[0] : '';

    navigate('/lesson-planner', {
      state: {
        prefill: {
          formData: {
            title: formValues.topic || result.lessonPlan.title || '',
            subject: '',
            gradeLevel: formValues.gradeLevel || '',
            duration: normalizedDuration,
            objectives: result.lessonPlan.objectives || [''],
            materials: result.lessonPlan.materials || [''],
          },
          aiGenerated: result.lessonPlan,
          source: 'ai-tools',
        },
      },
    });
  };

  const renderList = (items) => {
    if (!items || !items.length) {
      return <p className="empty-inline">No items available.</p>;
    }

    return (
      <ul className="formatted-list">
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    );
  };

  const renderStructuredResult = () => {
    if (!result) {
      return <p className="result-placeholder">Run the tool to see output here.</p>;
    }

    if (selectedTool === 'lesson-planner') {
      const lessonPlan = result.lessonPlan || {};
      return (
        <div className="result-panel">
          <h3>{lessonPlan.title || 'Generated Lesson Plan'}</h3>
          <p>{lessonPlan.introduction}</p>

          <h4>Objectives</h4>
          {renderList(lessonPlan.objectives)}

          <h4>Materials</h4>
          {renderList(lessonPlan.materials)}

          <h4>Learning Flow</h4>
          <p><strong>Strategies:</strong> {lessonPlan.instructionalStrategies || 'N/A'}</p>
          <p><strong>Activities:</strong> {lessonPlan.studentActivities || 'N/A'}</p>
          <p><strong>Assessment:</strong> {lessonPlan.assessment || 'N/A'}</p>
        </div>
      );
    }

    if (selectedTool === 'resource-summarizer') {
      const summary = result.summary || {};
      return (
        <div className="result-panel">
          <h3>{summary.title || 'Resource Summary'}</h3>
          <p>{summary.summary}</p>
          <h4>Key Points</h4>
          {renderList(summary.keyPoints)}
          <h4>Learning Outcomes</h4>
          {renderList(summary.learningOutcomes)}
        </div>
      );
    }

    if (selectedTool === 'voice-converter') {
      const lessonPlan = result.lessonPlan || {};
      return (
        <div className="result-panel">
          <h3>{lessonPlan.title || 'Converted Lesson Plan'}</h3>
          <p>{lessonPlan.content || 'No lesson plan content available.'}</p>
        </div>
      );
    }

    if (selectedTool === 'whiteboard-scanner') {
      const extracted = result.extractedContent || {};
      return (
        <div className="result-panel">
          <h3>Scanned Whiteboard</h3>
          <h4>Extracted Text</h4>
          <p>{extracted.text || 'No extracted text.'}</p>
          <h4>Formatted Lesson Content</h4>
          <p>{extracted.formattedLessonContent || 'No formatted lesson content.'}</p>
        </div>
      );
    }

    if (selectedTool === 'student-predictor') {
      const analysis = result.analysis || {};
      return (
        <div className="result-panel">
          <h3>Class Trend: {analysis.overallClassTrend || 'N/A'}</h3>
          <h4>At-Risk Students</h4>
          {!analysis.riskStudents?.length ? (
            <p className="empty-inline">No risk students identified.</p>
          ) : (
            <div className="result-cards">
              {analysis.riskStudents.map((student, index) => (
                <div className="result-card" key={`${student.studentName}-${index}`}>
                  <p><strong>{student.studentName}</strong> ({student.riskLevel || 'unknown'})</p>
                  <p>{(student.riskFactors || []).join(', ') || 'No factors listed.'}</p>
                </div>
              ))}
            </div>
          )}
          <h4>Class Strengths</h4>
          {renderList(analysis.classStrengths)}
          <h4>Areas of Improvement</h4>
          {renderList(analysis.classAreasOfImprovement)}
        </div>
      );
    }

    if (selectedTool === 'gap-analyzer') {
      const gapAnalysis = result.gapAnalysis || {};
      return (
        <div className="result-panel">
          <h3>{gapAnalysis.subject || 'Subject'} - {gapAnalysis.gradeLevel || 'Grade'}</h3>
          <div className="metric-row">
            <span>Coverage: {gapAnalysis.resourceCoveragePercentage ?? 0}%</span>
            <span>Underserved Topics: {gapAnalysis.underservedTopics ?? 0}</span>
            <span>Total Topics: {gapAnalysis.totalTopics ?? 0}</span>
          </div>

          <h4>Critical Gaps</h4>
          {!gapAnalysis.criticalGaps?.length ? (
            <p className="empty-inline">No critical gaps found.</p>
          ) : (
            <div className="result-cards">
              {gapAnalysis.criticalGaps.map((gap, index) => (
                <div className="result-card" key={`${gap.topic}-${index}`}>
                  <p><strong>{gap.topic}</strong></p>
                  <p>{gap.reason || 'No reason provided.'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="result-panel">
        <h3>Output</h3>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
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

  return (
    <div className="ai-tools-page">
      <div className="container">
        <h1>🤖 AI-Powered Tools</h1>
        <p className="subtitle">Transform your teaching with intelligent assistance</p>
        <div className="tool-summary-strip">
          <span>{TOOL_CONFIG.length} Intelligent Tools</span>
          <span>Fast Classroom Workflows</span>
          <span>Input, Generate, Apply</span>
        </div>

        <div className="tools-grid">
          {TOOL_CONFIG.map((tool) => (
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
                  <div className="tool-form-actions">
                    <button type="button" onClick={applyExampleInput}>Use Example</button>
                    <button type="button" onClick={resetCurrentTool}>Clear Output</button>
                  </div>

                  {renderToolForm()}
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Working...' : 'Generate'}
                  </button>
                </form>

                <div>
                  {renderStructuredResult()}
                  {result && (
                    <div className="result-actions">
                      {selectedTool === 'lesson-planner' && (
                        <button type="button" onClick={sendToLessonPlanner}>Send to Lesson Planner</button>
                      )}
                      <button type="button" onClick={copyResult}>Copy JSON</button>
                      <button type="button" onClick={downloadResult}>Download JSON</button>
                      {lastRunAt && <span>Last run: {lastRunAt.toLocaleTimeString()}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIToolsPage;
