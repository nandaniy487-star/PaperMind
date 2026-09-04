import React from 'react';

export default function Footer() {
  return (
    <footer className="footer" id="about">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">PaperMind</span>
            <p className="footer-tagline">AI-Powered Research Paper Assistant</p>
          </div>
          <div className="footer-stack">
            <span className="stack-item">FastAPI</span>
            <span className="stack-divider">/</span>
            <span className="stack-item">ChromaDB</span>
            <span className="stack-divider">/</span>
            <span className="stack-item">SentenceTransformers</span>
            <span className="stack-divider">/</span>
            <span className="stack-item">Google Gemini</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PaperMind. Built for researchers, academics, and curious minds.</p>
        </div>
      </div>
    </footer>
  );
}
