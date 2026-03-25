import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineClose } from 'react-icons/ai';
import { useAuthStore, useNotificationStore } from '../context/store';
import '../styles/navigation.css';

const Navigation = () => {
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-text">TeachNexus</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/resources" className="nav-link">Resources</Link>
          </li>
          <li className="nav-item">
            <Link to="/lesson-planner" className="nav-link">Planner</Link>
          </li>
          <li className="nav-item">
            <Link to="/community" className="nav-link">Community</Link>
          </li>
          <li className="nav-item">
            <Link to="/ai-tools" className="nav-link">AI Tools</Link>
          </li>
          <li className="nav-item">
            <Link to="/gamification" className="nav-link">Challenges</Link>
          </li>
        </ul>

        {/* Right Icons */}
        <div className="nav-icons">
          <Link to="/notifications" className="nav-icon notification-icon">
            <FaBell />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </Link>
          <Link to={`/profile/${user?._id}`} className="nav-icon">
            <FaUser />
          </Link>
          <button className="nav-icon logout-btn" onClick={logout}>
            <FaSignOutAlt />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/lesson-planner">Planner</Link>
          <Link to="/community">Community</Link>
          <Link to="/ai-tools">AI Tools</Link>
          <Link to="/gamification">Challenges</Link>
          <button onClick={() => { logout(); setMobileMenuOpen(false); }}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
