import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateResultsConclusion } from '../services/api';

export default function ResultsConclusion({ onBack }) {
  const [results, setResults] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadResultsConclusion() {
      try {
        const data = await generateResultsConclusion();
        setResults(data.results_conclusion);
      } catch (err) {
        console.error(err);
        setError('Failed to generate results and conclusion analysis.');
      } finally {
        setIsLoading(false);
      }
    }

    loadResultsConclusion();
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

            <h1>Results & Conclusion</h1>

            <p>
              Understand the key findings, experimental results,
              observations, and conclusions of the research paper.
            </p>
          </div>
        </div>

        <div className="study-notes-card">

          {isLoading ? (
            <div className="study-notes-loading">
              <div className="loading-spinner"></div>

              <p>
                Analyzing the results and conclusion...
              </p>
            </div>
          ) : error ? (
            <div className="study-notes-error">
              <p>{error}</p>
            </div>
          ) : (
            <div className="study-notes-content methodology-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {results}
              </ReactMarkdown>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}