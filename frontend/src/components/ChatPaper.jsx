import React, { useState } from 'react';
import axios from 'axios';

export default function ChatPaper({ onBack }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isLoading) return;

    // Add user's question to the chat
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: 'user',
        content: trimmedQuestion,
      },
    ]);

    setQuestion('');
    setIsLoading(true);

    try {
      // Send question to FastAPI backend
      const response = await axios.post('/api/ask-paper', {
        question: trimmedQuestion,
      });

      // Add AI answer to the chat
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: 'ai',
          content: response.data.answer,
        },
      ]);
    } catch (error) {
      console.error('Error asking question:', error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: 'ai',
          content:
            'Sorry, I could not process your question. Please make sure the backend is running and your research paper has been uploaded.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (suggestedQuestion) => {
    setQuestion(suggestedQuestion);
  };

  return (
    <div className="chat-page">
      <div className="chat-container">

        {/* Header */}
        <div className="chat-header">

          <button
            type="button"
            className="btn-back"
            onClick={onBack}
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="back-icon"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l-5.5-5.25a.75.75 0 010-1.08l-5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>

            Back
          </button>

          <div className="chat-title-section">

            <div className="upload-badge">
              <span className="badge-pulse" />
              <span>Research Paper Assistant</span>
            </div>

            <h1 className="chat-title">
              Chat with Your{' '}
              <span className="gradient-text">
                Research Paper
              </span>
            </h1>

            <p className="chat-subtitle">
              Ask questions and get answers grounded in your uploaded research paper.
            </p>

          </div>

        </div>

        {/* Paper Information */}
        <div className="chat-paper-card">

          <div className="chat-paper-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 2h9l5 5v15H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
              <path d="M14 2v6h6" />
              <path d="M8 13h8" />
              <path d="M8 17h6" />
            </svg>
          </div>

          <div>
            <span className="chat-paper-label">
              Current Research Paper
            </span>

            <strong className="chat-paper-name">
              Research Paper
            </strong>
          </div>

        </div>

        {/* Chat Area */}
        <div className="chat-card">

          <div className="chat-messages">

            {messages.length === 0 ? (

              <div className="chat-empty-state">

                <div className="chat-empty-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4v8z" />
                    <path d="M8 10h8" />
                    <path d="M8 14h5" />
                  </svg>
                </div>

                <h2>Ask anything about your paper</h2>

                <p>
                  PaperMind will use the research paper context to answer
                  your questions.
                </p>

                <div className="suggested-questions">

                  <button
                    type="button"
                    onClick={() =>
                      handleSuggestedQuestion(
                        'What is the main objective of this paper?'
                      )
                    }
                    disabled={isLoading}
                  >
                    What is the main objective of this paper?
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSuggestedQuestion(
                        'Explain the methodology used in this paper.'
                      )
                    }
                    disabled={isLoading}
                  >
                    Explain the methodology used in this paper.
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSuggestedQuestion(
                        'What are the main results of this paper?'
                      )
                    }
                    disabled={isLoading}
                  >
                    What are the main results of this paper?
                  </button>

                </div>

              </div>

            ) : (

              messages.map((message, index) => (

                <div
                  key={index}
                  className={`chat-message ${
                    message.role === 'user'
                      ? 'chat-message-user'
                      : 'chat-message-ai'
                  }`}
                >
                  <div className="chat-message-bubble">
                    {message.content}
                  </div>
                </div>

              ))

            )}

            {/* Loading message */}
            {isLoading && (
              <div className="chat-message chat-message-ai">
                <div className="chat-message-bubble">
                  PaperMind is analyzing your research paper...
                </div>
              </div>
            )}

          </div>

          {/* Input Area */}
          <div className="chat-input-area">

            <input
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSend();
                }
              }}
              placeholder={
                isLoading
                  ? 'PaperMind is generating an answer...'
                  : 'Ask a question about your research paper...'
              }
              disabled={isLoading}
            />

            <button
              type="button"
              className="chat-send-button"
              onClick={handleSend}
              disabled={!question.trim() || isLoading}
              aria-label="Send question"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>

          </div>

          <div className="chat-disclaimer">
            PaperMind answers questions using retrieved research-paper context.
          </div>

        </div>

      </div>
    </div>
  );
}