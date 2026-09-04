import React from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ currentView = 'landing', onNavigate }) {
  const handleBrandClick = (e) => {
    e.preventDefault();
    if (onNavigate) onNavigate('landing');
  };

  const handleGetStartedClick = () => {
    if (onNavigate) onNavigate('upload');
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <a href="#" className="nav-brand" onClick={handleBrandClick}>
          <div className="brand-logo-wrapper">
            <svg
              className="brand-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <path d="m12 7 2 2 4-4" />
            </svg>
          </div>
          <span className="brand-name">PaperMind</span>
          <span className="brand-badge">AI Assistant</span>
        </a>

        <nav className="nav-links">
          <a
            href="#features"
            className={`nav-link ${currentView === 'landing' ? 'active' : ''}`}
            onClick={(e) => {
              if (currentView !== 'landing' && onNavigate) {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  const el = document.getElementById('features');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }
            }}
          >
            Features
          </a>
          <a
            href="#pipeline"
            className="nav-link"
            onClick={(e) => {
              if (currentView !== 'landing' && onNavigate) {
                e.preventDefault();
                onNavigate('landing');
              }
            }}
          >
            How it Works
          </a>
          <a
            href="#about"
            className="nav-link"
            onClick={(e) => {
              if (currentView !== 'landing' && onNavigate) {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  const el = document.getElementById('about');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }
            }}
          >
            About
          </a>
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
          {currentView === 'upload' ? (
            <button
              className="btn-nav-secondary"
              type="button"
              onClick={() => onNavigate && onNavigate('landing')}
            >
              Home
            </button>
          ) : (
            <button
              className="btn-nav-primary"
              type="button"
              onClick={handleGetStartedClick}
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
