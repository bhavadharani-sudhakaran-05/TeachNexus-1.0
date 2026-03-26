import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaBook, FaAward } from 'react-icons/fa';
import '../styles/landing.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="container">
          <Link to="/" className="brand">TeachNexus</Link>
          <div className="nav-buttons">
            <Link to="/login" className="nav-btn">Login</Link>
            <Link to="/register" className="nav-btn btn-primary">Sign Up Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              The Professional Home<br /> 
              <span className="text-gradient">Teachers Deserve</span>
            </h1>
            <p className="hero-subtitle">
              Connect with 50,000+ educators, access 100,000+ verified resources, and transform your classroom with TeachNexus.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">Join for Free</Link>
              <button className="btn btn-secondary">Watch Demo</button>
            </div>
          </div>
          <div className="hero-image">
            <div className="dashboard-mockup">
              <div className="mock-header"></div>
              <div className="mock-content"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="container stats-grid">
          <div className="stat-card">
            <h3>50K+</h3>
            <p>Teachers Worldwide</p>
          </div>
          <div className="stat-card">
            <h3>100K+</h3>
            <p>Verified Resources</p>
          </div>
          <div className="stat-card">
            <h3>10K+</h3>
            <p>Lesson Plans Created</p>
          </div>
          <div className="stat-card">
            <h3>8K+</h3>
            <p>Schools Onboarded</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <h2>Transform Your Teaching</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaBook className="feature-icon" />
              <h3>Resource Sharing</h3>
              <p>Access and share thousands of high-quality teaching materials</p>
            </div>
            <div className="feature-card">
              <FaUsers className="feature-icon" />
              <h3>Community Learning</h3>
              <p>Connect with colleagues, discuss ideas, and grow together</p>
            </div>
            <div className="feature-card">
              <FaAward className="feature-icon" />
              <h3>Gamification</h3>
              <p>Earn badges, points, and recognition for your contributions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Transform Your Teaching?</h2>
          <p>Join thousands of educators building the future of education</p>
          <Link to="/register" className="btn btn-primary">Start Your Journey</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 TeachNexus. Empowering educators worldwide.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
