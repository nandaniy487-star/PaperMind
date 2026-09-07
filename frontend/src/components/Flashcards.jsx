import React, { useEffect, useState } from 'react';
import { generateFlashcards } from '../services/api';
import WorkspaceTabs from './WorkspaceTabs';

function parseFlashcards(rawText) {
  if (!rawText || typeof rawText !== 'string') return [];

  const cards = [];

  // Match patterns like Q1: / Question 1: / **Q1:** followed by A1: / Answer 1: / **A1:**
  const regex = /(?:^|\n)\s*(?:\*{0,2}(?:Q|Question)\s*\d*[:.]?\*{0,2})\s*([\s\S]*?)\s*(?:^|\n)\s*(?:\*{0,2}(?:A|Answer)\s*\d*[:.]?\*{0,2})\s*([\s\S]*?)(?=(?:\n\s*(?:\*{0,2}(?:Q|Question)\s*\d*[:.]?\*{0,2}))|$)/gi;

  let match;
  let index = 1;
  while ((match = regex.exec(rawText)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim();
    if (question && answer) {
      cards.push({
        id: index++,
        question,
        answer,
      });
    }
  }

  // Fallback line-by-line parsing if regex didn't extract any cards
  if (cards.length === 0) {
    const lines = rawText.split('\n');
    let currentQ = null;
    let currentA = null;

    for (const line of lines) {
      const trimmed = line.trim();
      const qMatch = trimmed.match(/^(?:\*{0,2}(?:Q|Question)\s*\d*[:.]?\*{0,2})\s*(.*)$/i);
      const aMatch = trimmed.match(/^(?:\*{0,2}(?:A|Answer)\s*\d*[:.]?\*{0,2})\s*(.*)$/i);

      if (qMatch) {
        if (currentQ && currentA) {
          cards.push({ id: cards.length + 1, question: currentQ.trim(), answer: currentA.trim() });
          currentA = null;
        }
        currentQ = qMatch[1];
      } else if (aMatch && currentQ !== null) {
        currentA = (currentA ? currentA + '\n' : '') + aMatch[1];
      } else if (currentA !== null) {
        currentA += '\n' + trimmed;
      } else if (currentQ !== null) {
        currentQ += ' ' + trimmed;
      }
    }

    if (currentQ && currentA) {
      cards.push({ id: cards.length + 1, question: currentQ.trim(), answer: currentA.trim() });
    }
  }

  return cards;
}

export default function Flashcards({ onBack, onNavigate }) {
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const paperId = localStorage.getItem('paperId');
  const paperFilename = localStorage.getItem('paperFilename') || 'Uploaded Research Paper';
  const paperChunks = localStorage.getItem('paperChunks');

  const fetchFlashcards = async () => {
    if (!paperId) {
      setIsLoading(false);
      setError('No active research paper found. Please upload a PDF first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setIsFlipped(false);
    setCurrentIndex(0);

    try {
      const response = await generateFlashcards(paperId);

      if (response && response.flashcards) {
        const parsed = parseFlashcards(response.flashcards);
        if (parsed.length > 0) {
          setFlashcards(parsed);
        } else {
          setError('Could not parse flashcards from the server response.');
        }
      } else {
        setError(response?.message || 'No flashcards could be generated for this paper.');
      }
    } catch (err) {
      console.error('Error generating flashcards:', err);
      setError(
        'Sorry, we could not generate flashcards. Please make sure your research paper has been uploaded and the backend is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, [paperId]);

  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    if (flashcards.length <= 1) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    if (flashcards.length <= 1) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="study-notes-page">
      <div className="study-notes-container">
        {/* Navigation / Back header */}
        <div className="upload-nav-header">
          <button type="button" className="btn-back" onClick={onBack}>
            <svg viewBox="0 0 20 20" fill="currentColor" className="back-icon" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            Back to Document
          </button>

          <div className="upload-breadcrumb">
            <span>PaperMind</span>
            <span className="crumb-sep">/</span>
            <span>Workspace</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">Flashcards</span>
          </div>
        </div>

        {/* Page Title & Instructions */}
        <div className="study-notes-header">
          <div className="upload-badge">
            <span className="badge-pulse" />
            <span>AI Flashcards &amp; Active Recall</span>
          </div>

          <h1 className="study-notes-title">
            Research <span className="gradient-text">Flashcards</span>
          </h1>

          <p className="study-notes-subtitle">
            Interactive active-recall flashcards generated from your research paper to master essential concepts, formulas, and findings.
          </p>
        </div>

        {/* Workspace Quick-Navigation Tabs */}
        <WorkspaceTabs activeTab="flashcards" onNavigate={onNavigate} />

        {/* Active Paper Banner */}
        <div className="active-doc-banner">
          <div className="active-doc-left">
            <div className="active-doc-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="doc-icon">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>

            <div className="active-doc-meta">
              <span className="active-doc-label">Active Research Paper</span>
              <strong className="active-doc-filename text-ellipsis" title={paperFilename}>
                {paperFilename}
              </strong>
            </div>

            {paperChunks && (
              <span className="active-doc-chunk-badge">
                {paperChunks} Chunks Indexed
              </span>
            )}
          </div>
        </div>

        {/* Content Card */}
        <div className="research-analysis-card">
          {isLoading ? (
            <div className="analysis-state-box">
              <div className="spinner-orbit" />
              <h3 className="state-title">Generating Flashcards...</h3>
              <p className="state-description">
                Extracting core concepts, questions, and answers from your research paper for active recall.
              </p>
            </div>
          ) : error ? (
            <div className="analysis-state-box error-state">
              <div className="error-icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="state-title">Unable to Generate Flashcards</h3>
              <p className="state-description">{error}</p>
              <button
                type="button"
                className="btn-flashcard-action btn-flashcard-secondary"
                onClick={fetchFlashcards}
              >
                Try Again
              </button>
            </div>
          ) : flashcards.length > 0 ? (
            <div className="flashcards-wrapper">
              <div className="flashcards-progress-bar">
                <span className="flashcard-counter">
                  Card {currentIndex + 1} of {flashcards.length}
                </span>
                <div className="flashcard-progress-track">
                  <div
                    className="flashcard-progress-fill"
                    style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Flashcard Box */}
              <div
                className={`flashcard-item ${isFlipped ? 'flipped' : ''}`}
                onClick={handleFlip}
                role="button"
                tabIndex={0}
                aria-label="Toggle Flashcard Flip"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleFlip();
                  }
                }}
              >
                <div className="flashcard-inner">
                  <div className="flashcard-face flashcard-front">
                    <span className="flashcard-pill">Question</span>
                    <div className="flashcard-body">
                      <h3 className="flashcard-text">{currentCard?.question}</h3>
                    </div>
                    <span className="flashcard-hint">Click card or button to reveal answer ↻</span>
                  </div>

                  <div className="flashcard-face flashcard-back">
                    <span className="flashcard-pill pill-answer">Answer</span>
                    <div className="flashcard-body">
                      <p className="flashcard-text answer-text">{currentCard?.answer}</p>
                    </div>
                    <span className="flashcard-hint">Click card or button to flip back ↺</span>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flashcard-controls">
                <button
                  type="button"
                  className="btn-flashcard-action btn-flashcard-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  disabled={flashcards.length <= 1}
                  aria-label="Previous Flashcard"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  className="btn-flashcard-action btn-flashcard-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlip();
                  }}
                  aria-label="Flip Flashcard"
                >
                  Flip Card
                </button>
                <button
                  type="button"
                  className="btn-flashcard-action btn-flashcard-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  disabled={flashcards.length <= 1}
                  aria-label="Next Flashcard"
                >
                  Next →
                </button>
              </div>
            </div>
          ) : (
            <div className="analysis-state-box">
              <h3 className="state-title">No Flashcards Available</h3>
              <p className="state-description">
                No flashcards could be generated from the uploaded document.
              </p>
              <button
                type="button"
                className="btn-flashcard-action btn-flashcard-secondary"
                onClick={fetchFlashcards}
              >
                Generate Flashcards
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
