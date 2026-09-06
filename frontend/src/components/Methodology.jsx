import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateMethodology } from '../services/api';

export default function Methodology({ onBack }) {
  const [methodology, setMethodology] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMethodology() {
      try {
        const data = await generateMethodology();
        setMethodology(data.methodology);
      } catch (err) {
        console.error(err);
        setError('Failed to generate methodology analysis.');
      } finally {
        setIsLoading(false);
      }
    }

    loadMethodology();
  }, []);

  return (
    <section className="study-notes-page">
      <div className="study-notes-container">

        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="study-notes-header">
          <div>
            <p className="eyebrow">PaperMind AI</p>

            <h1>Methodology Analysis</h1>

            <p>
              Understand how the research was conducted and how the
              proposed system or method works.
            </p>
          </div>
        </div>

        <div className="study-notes-card">

          {isLoading ? (
            <div className="study-notes-loading">
              <div className="loading-spinner"></div>

              <p>
                Analyzing the research methodology...
              </p>
            </div>
          ) : error ? (
            <div className="study-notes-error">
              <p>{error}</p>
            </div>
          ) : (
            <div className="study-notes-content methodology-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {methodology}
              </ReactMarkdown>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}