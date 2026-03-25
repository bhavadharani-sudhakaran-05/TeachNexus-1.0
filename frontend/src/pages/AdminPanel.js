import React from 'react';
import '../styles/admin.css';

const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <div className="container">
        <h1>🛡️ Administration Panel</h1>

        <div className="admin-sections">
          <div className="admin-card">
            <h2>📊 School Health Report</h2>
            <p>View comprehensive school engagement metrics</p>
            <button className="btn btn-secondary">View Report</button>
          </div>

          <div className="admin-card">
            <h2>📅 Smart Timetable Builder</h2>
            <p>Auto-generate conflict-free school timetables</p>
            <button className="btn btn-secondary">Generate Timetable</button>
          </div>

          <div className="admin-card">
            <h2>🗳️ Classroom Polling</h2>
            <p>Create live polls and quizzes for real-time feedback</p>
            <button className="btn btn-secondary">Create Poll</button>
          </div>

          <div className="admin-card">
            <h2>🎓 Curriculum Mapping</h2>
            <p>Map resources to curriculum standards and find gaps</p>
            <button className="btn btn-secondary">Create Mapping</button>
          </div>

          <div className="admin-card">
            <h2>👥 Mentor Matching</h2>
            <p>Connect new teachers with experienced mentors</p>
            <button className="btn btn-secondary">Find Mentor</button>
          </div>

          <div className="admin-card">
            <h2>📝 Bulk Teacher Management</h2>
            <p>Import and manage multiple teacher accounts</p>
            <button className="btn btn-secondary">Manage Teachers</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
