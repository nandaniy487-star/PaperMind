import React from 'react';

const featuresList = [
  {
    title: 'Intelligent PDF Parsing',
    description:
      'Extracts dense scientific layouts, tables, and multi-column text seamlessly with PyMuPDF and sliding-window chunking.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.342a2 2 0 0 0-.602-1.43l-4.44-4.342A2 2 0 0 0 11.56 2H6a2 2 0 0 0-2 2z" />
        <path d="M9 13h6" />
        <path d="M9 17h3" />
        <path d="M14 2v6h6" />
      </svg>
    ),
    badge: 'PyMuPDF Engine'
  },
  {
    title: 'Precision Vector Store',
    description:
      'Dense embeddings generated via SentenceTransformers and indexed in persistent ChromaDB for sub-second semantic retrieval.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
      </svg>
    ),
    badge: 'ChromaDB + MiniLM'
  },
  {
    title: 'Grounded RAG Synthesis',
    description:
      'Answers are synthesized by Google Gemini under strict prompt guardrails to guarantee evidence-based, hallucination-resistant answers.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" />
        <path d="m4.93 4.93 2.83 2.83" />
        <path d="M2 12h4" />
        <path d="m4.93 19.07 2.83-2.83" />
        <path d="M12 18v4" />
        <path d="m19.07 19.07-2.83-2.83" />
        <path d="M18 12h4" />
        <path d="m19.07 4.93-2.83 2.83" />
      </svg>
    ),
    badge: 'Gemini 3.6 Flash'
  }
];

export default function Features() {
  return (
    <section id="features" className="features-section">
      <div className="section-header">
        <span className="section-pill">Core Architecture</span>
        <h2 className="section-title">Engineered for Rigorous Academic Workflows</h2>
        <p className="section-subtitle">
          Experience an end-to-end retrieval-augmented pipeline designed specifically for research papers.
        </p>
      </div>

      <div className="features-grid">
        {featuresList.map((feat, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon-wrapper">{feat.icon}</div>
            <span className="feature-tech-badge">{feat.badge}</span>
            <h3 className="feature-title">{feat.title}</h3>
            <p className="feature-description">{feat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
