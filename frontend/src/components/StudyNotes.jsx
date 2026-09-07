import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateStudyNotes } from '../services/api';
import WorkspaceTabs from './WorkspaceTabs';

export default function StudyNotes({ onBack, onNavigate }) {
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const paperId = localStorage.getItem('paperId');
  const paperFilename = localStorage.getItem('paperFilename') || 'Uploaded Research Paper';
  const paperChunks = localStorage.getItem('paperChunks');

  const fetchNotes = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await generateStudyNotes(paperId);

      if (response.notes) {
        setNotes(response.notes);
      } else {
        setError(response.message || 'No study notes could be generated for this paper.');
      }
    } catch (err) {
      console.error('Error generating study notes:', err);
      setError(
        'Sorry, we could not generate study notes. Please make sure your research paper has been uploaded and the backend is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [paperId]);

  const handleCopy = () => {
    if (!notes) return;
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <span className="crumb-current">Study Notes</span>
          </div>
        </div>

        {/* Page Title & Instructions */}
        <div className="study-notes-header">
          <div className="upload-badge">
            <span className="badge-pulse" />
            <span>AI Study Assistant</span>
          </div>

          <h1 className="study-notes-title">
            Study <span className="gradient-text">Notes</span>
          </h1>

          <p className="study-notes-subtitle">
            Comprehensive, structured study notes synthesized from your research paper's core concepts.
          </p>
        </div>

        {/* Workspace Quick-Navigation Tabs */}
        <WorkspaceTabs activeTab="study-notes" onNavigate={onNavigate} />

        {/* Active Paper Banner with Copy Action */}
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

          <div className="active-doc-right">
            {notes && !isLoading && (
              <button
                type="button"
                className={`btn-action-copy ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                title="Copy notes to clipboard"
              >
                {copied ? (
                  <>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="copy-icon">
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="copy-icon">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>Copy Notes</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Content Card */}
        <div className="research-analysis-card">
          {isLoading ? (
            <div className="analysis-state-box">
              <div className="spinner-orbit" />
              <h3 className="state-title">Synthesizing Study Notes...</h3>
              <p className="state-description">
                Analyzing core sections, extracting theoretical foundations, and formatting study concepts.
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
              <h3 className="state-title">Unable to Generate Notes</h3>
              <p className="state-description">{error}</p>
              <button type="button" className="btn-secondary" onClick={fetchNotes}>
                Try Again
              </button>
            </div>
          ) : (
            <div className="research-markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {notes}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}