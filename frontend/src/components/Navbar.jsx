import React from 'react';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-container">
        <a href="#" className="nav-brand">
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
          <a href="#features" className="nav-link">Features</a>
          <a href="#pipeline" className="nav-link">How it Works</a>
          <a href="#about" className="nav-link">About</a>
        </nav>

        <div className="nav-actions">
          <button className="btn-nav-primary" type="button">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
