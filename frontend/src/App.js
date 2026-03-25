import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import io from 'socket.io-client';

// Context & Stores
import { useAuthStore } from './context/store';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ResourceLibrary from './pages/ResourceLibrary';
import LessonPlannerPage from './pages/LessonPlannerPage';
import CommunityPage from './pages/CommunityPage';
import AIToolsPage from './pages/AIToolsPage';
import GamificationPage from './pages/GamificationPage';
import AdminPanel from './pages/AdminPanel';
import UserProfile from './pages/UserProfile';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import NotificationCenter from './components/NotificationCenter';

function App() {
  const { token, setUser } = useAuthStore();
  const socket = React.useRef(null);

  useEffect(() => {
    // Initialize socket connection
    if (token) {
      socket.current = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        auth: { token },
      });

      socket.current.on('connect', () => {
        console.log('Connected to server');
      });

      return () => {
        socket.current?.disconnect();
      };
    }
  }, [token]);

  return (
    <BrowserRouter>
      <div className="App">
        {token && <Navigation />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <ResourceLibrary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lesson-planner"
            element={
              <ProtectedRoute>
                <LessonPlannerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools"
            element={
              <ProtectedRoute>
                <AIToolsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gamification"
            element={
              <ProtectedRoute>
                <GamificationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        {token && <NotificationCenter socket={socket.current} />}
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;
