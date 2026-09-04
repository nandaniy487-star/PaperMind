import React from 'react';

export default function Hero({ onGetStarted }) {
  return (
    <section className="hero-section">
      <div className="hero-glow-bg" />
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-pulse" />
          <span className="badge-text">Next-Gen Academic Research Assistant</span>
        </div>

        <h1 className="hero-title">
          Understand Complex Research Papers in <span className="gradient-text">Seconds</span>
        </h1>

        <p className="hero-tagline">
          PaperMind is an AI-powered research paper assistant that indexes academic publications,
          retrieves high-precision context, and answers your most intricate scientific questions
          with verified accuracy.
        </p>

        <div className="hero-cta-group">
          <button className="btn-primary btn-large" type="button" onClick={onGetStarted}>
            Get Started
            <svg
              className="btn-arrow"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <a href="#features" className="btn-secondary btn-large">
            Explore Capabilities
          </a>
        </div>

        {/* Visual Preview Card */}
        <div className="preview-card-wrapper">
          <div className="preview-card">
            <div className="card-header">
              <div className="card-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>
              <div className="card-doc-info">
                <svg className="doc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span className="doc-name">Attention_Is_All_You_Need.pdf</span>
                <span className="doc-tag">Indexed · 48 Chunks</span>
              </div>
            </div>

            <div className="card-body">
              <div className="mock-chat-bubble user-query">
                <div className="bubble-label">Query</div>
                <p>What is the primary advantage of the Multi-Head Attention mechanism?</p>
              </div>

              <div className="mock-chat-bubble ai-response">
                <div className="bubble-label ai-label">
                  <span className="sparkle">✦</span> PaperMind RAG
                </div>
                <p>
                  Multi-Head Attention allows the model to jointly attend to information from different representation
                  subspaces at different positions. With a single attention head, averaging inhibits this capability.
                </p>
                <div className="source-citation">
                  <span className="citation-badge">Source: Section 3.2.2 (p. 5) · Similarity: 0.89</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
