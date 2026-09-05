import React, { useState, useRef } from 'react';
import { uploadPaper } from '../services/api';

export default function UploadPaper({ onBack, onChat }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);
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
      day: 'numeric',
    });
  };

  const processFile = (file) => {
    setErrorMessage('');
    setSuccessData(null);

    if (!file) return;

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

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

    if (!isLoading) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoading && !isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget.contains(e.relatedTarget)) return;

    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    if (isLoading) return;

    const files = e.dataTransfer?.files;

    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleRemoveFile = () => {
    if (isLoading) return;

    setSelectedFile(null);
    setErrorMessage('');
    setSuccessData(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = async () => {
    if (!selectedFile || isLoading) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessData(null);

    try {
      const data = await uploadPaper(selectedFile);
      setSuccessData(data);
    } catch (error) {
      console.error('Upload failed:', error);

      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;

        setErrorMessage(
          typeof detail === 'string'
            ? detail
            : JSON.stringify(detail)
        );
      } else if (error.message === 'Network Error') {
        setErrorMessage(
          'Could not connect to PaperMind backend at http://127.0.0.1:8000. Please verify the FastAPI server is running.'
        );
      } else {
        setErrorMessage(
          error.message || 'An error occurred during paper upload.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadAnother = () => {
    setSelectedFile(null);
    setSuccessData(null);
    setErrorMessage('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">

        {/* Navigation / Back header */}
        <div className="upload-nav-header">
          <button
            className="btn-back"
            type="button"
            onClick={onBack}
            disabled={isLoading}
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="back-icon"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l-5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
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
            Upload Your{' '}
            <span className="gradient-text">Research Paper</span>
          </h1>

          <p className="upload-subtitle">
            Upload an academic publication in PDF format. The backend extracts
            text, chunks it with overlap, generates dense vector embeddings,
            and stores them in ChromaDB.
          </p>
        </div>

        {/* Upload Card Area */}
        <div className="upload-card">

          {/* If upload succeeded, display success summary card */}
          {successData ? (
            <div className="upload-success-view">

              <div className="success-icon-box">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="success-check-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div className="success-text-content">
                <h3 className="success-title">
                  {successData.message || 'Upload Complete!'}
                </h3>

                <p className="success-subtext">
                  Your research paper is now indexed and stored in ChromaDB,
                  ready for contextual AI inquiries.
                </p>
              </div>

              <div className="success-meta-grid">

                <div className="meta-stat-card">
                  <span className="stat-label">Document</span>

                  <strong
                    className="stat-value text-ellipsis"
                    title={successData.filename}
                  >
                    {successData.filename}
                  </strong>
                </div>

                <div className="meta-stat-card highlight-stat">
                  <span className="stat-label">Chunks Created</span>

                  <strong className="stat-value">
                    {successData.chunks_created}
                  </strong>
                </div>

                <div className="meta-stat-card">
                  <span className="stat-label">Vector Store</span>

                  <strong className="stat-value stat-status">
                    ChromaDB Indexed
                  </strong>
                </div>

              </div>

              {/* Success Actions */}
              <div className="success-actions">

                {/* NEW: Chat with Research Paper */}
                <button
                  type="button"
                  className="btn-upload-submit"
                  onClick={onChat}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="btn-icon"
                  >
                    <path d="M21 11.5a8.38 8.38 0 01-9 8.5 8.5 8.5 0 01-4.5-1.3L3 20l1.3-4.5A8.38 8.38 0 013 11.5a8.5 8.5 0 1118 0z" />
                    <path d="M8 11h.01" />
                    <path d="M12 11h.01" />
                    <path d="M16 11h.01" />
                  </svg>
                  Chat with Research Paper
                </button>

                <button
                  type="button"
                  className="btn-upload-submit"
                  onClick={handleUploadAnother}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="btn-icon"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload Another Paper
                </button>

                <button
                  type="button"
                  className="btn-cancel"
                  onClick={onBack}
                >
                  Return to Home
                </button>

              </div>
            </div>
          ) : (
            <>
              {/* Dropzone */}
              <div
                className={`dropzone ${
                  isDragging ? 'dropzone-active' : ''
                } ${
                  selectedFile ? 'dropzone-has-file' : ''
                } ${
                  isLoading ? 'dropzone-disabled' : ''
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() =>
                  !isLoading && fileInputRef.current?.click()
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (
                    (e.key === 'Enter' || e.key === ' ') &&
                    !isLoading
                  ) {
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
                  disabled={isLoading}
                />

                <div className="dropzone-icon-box">
                  {isLoading ? (
                    <div className="spinner-orbit" />
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="dropzone-icon"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  )}
                </div>

                <div className="dropzone-text-group">
                  <h3 className="dropzone-prompt">
                    {isLoading
                      ? 'Processing and indexing document...'
                      : isDragging
                      ? 'Drop your PDF here'
                      : 'Drag and drop your PDF research paper'}
                  </h3>

                  <p className="dropzone-subprompt">
                    {isLoading
                      ? 'Please wait while text is extracted and embeddings are computed'
                      : 'or click to browse from your computer'}
                  </p>

                  <div className="dropzone-meta-pill">
                    Supported: PDF (up to 50MB)
                  </div>
                </div>
              </div>

              {/* Validation or API Error Banner */}
              {errorMessage && (
                <div className="alert-banner alert-error">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="alert-icon"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <div className="alert-text-wrapper">
                    <strong>Upload Error:</strong>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Selected File Details Card */}
              {selectedFile && (
                <div className="file-info-card">
                  <div className="file-info-header">

                    <div className="file-icon-badge">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="pdf-icon"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>

                    <div className="file-primary-details">
                      <div className="file-name-row">
                        <span
                          className="file-name"
                          title={selectedFile.name}
                        >
                          {selectedFile.name}
                        </span>

                        <span
                          className={`file-status-tag ${
                            isLoading ? 'tag-indexing' : ''
                          }`}
                        >
                          {isLoading
                            ? 'Indexing in progress...'
                            : 'Ready to Process'}
                        </span>
                      </div>

                      <div className="file-meta-row">
                        <span className="meta-item">
                          Size: {formatFileSize(selectedFile.size)}
                        </span>

                        <span className="meta-dot">•</span>

                        <span className="meta-item">
                          Modified: {formatDate(selectedFile.lastModified)}
                        </span>

                        <span className="meta-dot">•</span>

                        <span className="meta-item">
                          Target: /upload-paper
                        </span>
                      </div>
                    </div>

                    {!isLoading && (
                      <button
                        type="button"
                        className="btn-remove-file"
                        onClick={handleRemoveFile}
                        title="Remove file"
                        aria-label="Remove selected file"
                      >
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="remove-icon"
                        >
                          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l-3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Ingestion in progress helper notice */}
              {isLoading && (
                <div className="loading-stage-notice">
                  <div className="pulse-spinner" />

                  <div className="loading-stage-text">
                    <strong>Processing Research Paper...</strong>

                    <span>
                      Extracting text via PyMuPDF, computing dense embeddings,
                      and updating ChromaDB. Please don't refresh.
                    </span>
                  </div>
                </div>
              )}

              {/* Action Row */}
              <div className="upload-actions">
                <button
                  type="button"
                  className={`btn-upload-submit ${
                    !selectedFile || isLoading ? 'btn-disabled' : ''
                  }`}
                  disabled={!selectedFile || isLoading}
                  onClick={handleUploadClick}
                >
                  {isLoading ? (
                    <>
                      <div className="btn-spinner" />
                      Uploading &amp; Analyzing...
                    </>
                  ) : (
                    <>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="btn-icon"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Upload &amp; Analyze
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn-cancel"
                  onClick={onBack}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>

        {/* Pipeline Information Preview */}
        <div className="pipeline-preview">
          <h4 className="pipeline-title">
            Backend RAG Pipeline Process:
          </h4>

          <div className="pipeline-steps">

            <div className="pipeline-step">
              <div className="step-num">1</div>

              <div className="step-text">
                <strong>PyMuPDF Text Extraction</strong>
                <span>
                  Directly processes PDF streams and extracts full paper content.
                </span>
              </div>
            </div>

            <div className="pipeline-step">
              <div className="step-num">2</div>

              <div className="step-text">
                <strong>Chunking &amp; MiniLM Vectors</strong>
                <span>
                  1000-character windows embedded into ChromaDB with 384 dimensions.
                </span>
              </div>
            </div>

            <div className="pipeline-step">
              <div className="step-num">3</div>

              <div className="step-text">
                <strong>Ready for Gemini 3.6</strong>
                <span>
                  Indexed vectors are primed for semantic similarity search &amp; RAG answers.
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}