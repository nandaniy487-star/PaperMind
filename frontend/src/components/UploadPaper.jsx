import React, { useState, useRef } from 'react';

export default function UploadPaper({ onBack }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadNotice, setUploadNotice] = useState('');
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const processFile = (file) => {
    setErrorMessage('');
    setUploadNotice('');

    if (!file) return;

    // Validate PDF type or extension
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setErrorMessage('Please select a valid PDF document (.pdf).');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only reset if leaving the drop container
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setErrorMessage('');
    setUploadNotice('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    if (!selectedFile) return;
    setUploadNotice(
      `File "${selectedFile.name}" prepared for analysis. (Backend integration will be connected in the next step.)`
    );
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        {/* Navigation / Back header */}
        <div className="upload-nav-header">
          <button className="btn-back" type="button" onClick={onBack}>
            <svg viewBox="0 0 20 20" fill="currentColor" className="back-icon" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            Back to Home
          </button>
          <div className="upload-breadcrumb">
            <span>PaperMind</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">Upload Paper</span>
          </div>
        </div>

        {/* Page Title & Instructions */}
        <div className="upload-header">
          <div className="upload-badge">
            <span className="badge-pulse" />
            <span>Document Ingestion</span>
          </div>
          <h1 className="upload-title">
            Upload Your <span className="gradient-text">Research Paper</span>
          </h1>
          <p className="upload-subtitle">
            Upload any academic publication or scientific report in PDF format. PaperMind will extract text,
            generate dense embeddings, and index it in ChromaDB for instant contextual Q&amp;A.
          </p>
        </div>

        {/* Upload Card Area */}
        <div className="upload-card">
          {/* Dropzone */}
          <div
            className={`dropzone ${isDragging ? 'dropzone-active' : ''} ${selectedFile ? 'dropzone-has-file' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                fileInputRef.current?.click();
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="file-input-hidden"
              onChange={handleFileChange}
            />

            <div className="dropzone-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropzone-icon">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <div className="dropzone-text-group">
              <h3 className="dropzone-prompt">
                {isDragging ? 'Drop your PDF here' : 'Drag and drop your PDF research paper'}
              </h3>
              <p className="dropzone-subprompt">
                or <span className="highlight-browse">click to browse</span> from your device
              </p>
              <div className="dropzone-meta-pill">Supported: PDF (up to 50MB)</div>
            </div>
          </div>

          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="alert-banner alert-error">
              <svg viewBox="0 0 20 20" fill="currentColor" className="alert-icon">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Selected File Details Card */}
          {selectedFile && (
            <div className="file-info-card">
              <div className="file-info-header">
                <div className="file-icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pdf-icon">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>

                <div className="file-primary-details">
                  <div className="file-name-row">
                    <span className="file-name" title={selectedFile.name}>
                      {selectedFile.name}
                    </span>
                    <span className="file-status-tag">Ready to Process</span>
                  </div>
                  <div className="file-meta-row">
                    <span className="meta-item">Size: {formatFileSize(selectedFile.size)}</span>
                    <span className="meta-dot">•</span>
                    <span className="meta-item">Modified: {formatDate(selectedFile.lastModified)}</span>
                    <span className="meta-dot">•</span>
                    <span className="meta-item">Type: PDF</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-remove-file"
                  onClick={handleRemoveFile}
                  title="Remove file"
                  aria-label="Remove selected file"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="remove-icon">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Upload Status Notice (Simulated state notification) */}
          {uploadNotice && (
            <div className="alert-banner alert-success">
              <svg viewBox="0 0 20 20" fill="currentColor" className="alert-icon">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{uploadNotice}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="upload-actions">
            <button
              type="button"
              className={`btn-upload-submit ${!selectedFile ? 'btn-disabled' : ''}`}
              disabled={!selectedFile}
              onClick={handleUploadClick}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-icon">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload &amp; Analyze
            </button>
            <button type="button" className="btn-cancel" onClick={onBack}>
              Cancel
            </button>
          </div>
        </div>

        {/* Pipeline Information Preview */}
        <div className="pipeline-preview">
          <h4 className="pipeline-title">What happens when you upload:</h4>
          <div className="pipeline-steps">
            <div className="pipeline-step">
              <div className="step-num">1</div>
              <div className="step-text">
                <strong>Text &amp; Layout Extraction</strong>
                <span>PyMuPDF extracts academic sections, headings, and clean text.</span>
              </div>
            </div>
            <div className="pipeline-step">
              <div className="step-num">2</div>
              <div className="step-text">
                <strong>Chunking &amp; Vector Store</strong>
                <span>1000-char sliding windows embedded via MiniLM into ChromaDB.</span>
              </div>
            </div>
            <div className="pipeline-step">
              <div className="step-num">3</div>
              <div className="step-text">
                <strong>Ready for Gemini RAG</strong>
                <span>Ask queries and receive cited answers strictly from the document.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
