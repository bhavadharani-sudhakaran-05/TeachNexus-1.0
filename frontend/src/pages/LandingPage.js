import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaBook, FaAward, FaStar, FaCheckCircle, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import '../styles/landing.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="container">
          <Link to="/" className="brand">📚 TeachNexus</Link>
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
              The Professional<br />
              Home<br />
              <span className="text-gradient">Teachers Deserve</span>
            </h1>
            <p className="hero-subtitle">
              Connect with 50,000+ educators, access 100,000+ verified resources, and transform your classroom with AI-powered tools and collaborative learning.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">🚀 Join for Free</Link>
              <button className="btn btn-secondary">▶ Watch Demo</button>
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
              <h3>📚 Resource Sharing</h3>
              <p>Access and share thousands of high-quality teaching materials with built-in remixing (like GitHub forking) to adapt content to your classroom.</p>
            </div>
            <div className="feature-card">
              <FaUsers className="feature-icon" />
              <h3>👥 Community Learning</h3>
              <p>Connect with colleagues worldwide, discuss ideas, get peer reviews, and grow together through real-time messaging and mentorship matching.</p>
            </div>
            <div className="feature-card">
              <FaAward className="feature-icon" />
              <h3>🏆 Gamification</h3>
              <p>Earn badges, XP points, and recognition for your contributions. Track CPD credits and stay motivated with weekly challenges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="stats" style={{ backgroundColor: '#f9fafb' }}>
        <div className="container">
          <h2 style={{ marginBottom: '3rem' }}>What Teachers Say</h2>
          <div className="features-grid">
            <div className="feature-card" style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.25rem' }}>
                {[...Array(5)].map(() => <FaStar key={Math.random()} color="#f59e0b" />)}
              </div>
              <p style={{ fontStyle: 'italic', marginBottom: '1.5rem' }}>
                "TeachNexus transformed how I find resources. The remixing feature saves me hours every week!"
              </p>
              <p style={{ fontWeight: 600, color: '#1e3a5f', margin: 0 }}>Sarah M., High School Biology</p>
            </div>
            <div className="feature-card" style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.25rem' }}>
                {[...Array(5)].map(() => <FaStar key={Math.random()} color="#f59e0b" />)}
              </div>
              <p style={{ fontStyle: 'italic', marginBottom: '1.5rem' }}>
                "Finally, a platform built FOR teachers BY teachers. The AI lesson planner is absolutely incredible!"
              </p>
              <p style={{ fontWeight: 600, color: '#1e3a5f', margin: 0 }}>James P., Middle School Math</p>
            </div>
            <div className="feature-card" style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.25rem' }}>
                {[...Array(5)].map(() => <FaStar key={Math.random()} color="#f59e0b" />)}
              </div>
              <p style={{ fontStyle: 'italic', marginBottom: '1.5rem' }}>
                "Our school switched completely. Teachers are more connected and professional development tracking is seamless."
              </p>
              <p style={{ fontWeight: 600, color: '#1e3a5f', margin: 0 }}>Dr. Linda K., School Principal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="features">
        <div className="container">
          <h2>Simple, Transparent Pricing</h2>
          <div className="features-grid">
            <div className="feature-card" style={{ border: '2px solid #ddd' }}>
              <h3>🎓 Free</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e3a5f', margin: '1rem 0' }}>$0</p>
              <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaCheckCircle color="#f59e0b" /> Access 100K+ resources
                </li>
                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaCheckCircle color="#f59e0b" /> Create lesson plans
                </li>
                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaCheckCircle color="#f59e0b" /> Join communities
                </li>
              </ul>
              <Link to="/register" className="btn btn-secondary" style={{ marginTop: '1.5rem', width: '100%' }}>Start Free</Link>
            </div>
            <div className="feature-card" style={{ border: '3px solid #f59e0b', position: 'relative', top: '-10px' }}>
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem' }}>Most Popular</div>
              <h3>⭐ Pro</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e3a5f', margin: '1rem 0' }}>$9.99<span style={{ fontSize: '1rem' }}>/mo</span></p>
              <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaCheckCircle color="#f59e0b" /> Everything in Free
                </li>
                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaCheckCircle color="#f59e0b" /> AI Lesson Generator
                </li>
                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaCheckCircle color="#f59e0b" /> Real-time Collaboration
                </li>
                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaCheckCircle color="#f59e0b" /> Priority Support
                </li>
              </ul>
              <Link to="/register" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>Get Started</Link>
            </div>
            <div className="feature-card" style={{ border: '2px solid #ddd' }}>
              <h3>🏫 School</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e3a5f', margin: '1rem 0' }}>Custom</p>
              <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaCheckCircle color="#f59e0b" /> Unlimited everything
                </li>
                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaCheckCircle color="#f59e0b" /> School Admin Panel
                </li>
                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaCheckCircle color="#f59e0b" /> Dedicated Support
                </li>
                <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaCheckCircle color="#f59e0b" /> SSO & Analytics
                </li>
              </ul>
              <button className="btn btn-secondary" style={{ marginTop: '1.5rem', width: '100%' }}>Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Transform Your Teaching?</h2>
          <p>Join thousands of educators building the future of education. Start for free, no credit card required.</p>
          <Link to="/register" className="btn btn-primary">Start Your Journey Now →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container" style={{ maxWidth: '100%', padding: '0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', padding: '2rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            <div>
              <h4 style={{ color: 'white', marginBottom: '1rem' }}>TeachNexus</h4>
              <p>Empowering educators worldwide with cutting-edge collaboration tools.</p>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '1rem' }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a></li>
                <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a></li>
                <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Security</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '1rem' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About</a></li>
                <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</a></li>
                <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: '1rem' }}>Social</h4>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" style={{ color: 'inherit' }}><FaFacebook size={20} /></a>
                <a href="#" style={{ color: 'inherit' }}><FaTwitter size={20} /></a>
                <a href="#" style={{ color: 'inherit' }}><FaLinkedin size={20} /></a>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '2rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
            <p style={{ margin: 0 }}>&copy; 2026 TeachNexus. All rights reserved. | <a href="#" style={{ color: 'inherit' }}>Privacy Policy</a> | <a href="#" style={{ color: 'inherit' }}>Terms of Service</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
