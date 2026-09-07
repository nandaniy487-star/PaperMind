import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import UploadPaper from './components/UploadPaper';
import ChatPaper from './components/ChatPaper';
import StudyNotes from './components/StudyNotes';
import Methodology from './components/Methodology';
import ResultsConclusion from './components/ResultsConclusion';
import Flashcards from './components/Flashcards';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');

  return (
    <ThemeProvider>
      <div className="app-shell">
        <Navbar
          currentView={currentView}
          onNavigate={setCurrentView}
        />

        <main className="main-content">
          {currentView === 'landing' ? (
            <>
              <Hero
                onGetStarted={() => setCurrentView('upload')}
              />
              <Features />
            </>
          ) : currentView === 'upload' ? (
            <UploadPaper
              onBack={() => setCurrentView('landing')}
              onChat={() => setCurrentView('chat')}
              onStudyNotes={() => setCurrentView('study-notes')}
              onMethodology={() => setCurrentView('methodology')}
              onResultsConclusion={() => setCurrentView('results-conclusion')}
              onFlashcards={() => setCurrentView('flashcards')}
            />
          ) : currentView === 'chat' ? (
            <ChatPaper
              onBack={() => setCurrentView('upload')}
              onNavigate={setCurrentView}
            />
          ) : currentView === 'study-notes' ? (
            <StudyNotes
              onBack={() => setCurrentView('upload')}
              onNavigate={setCurrentView}
            />
          ) : currentView === 'methodology' ? (
            <Methodology
              onBack={() => setCurrentView('upload')}
              onNavigate={setCurrentView}
            />
          ) : currentView === 'results-conclusion' ? (
            <ResultsConclusion
              onBack={() => setCurrentView('upload')}
              onNavigate={setCurrentView}
            />
          ) : currentView === 'flashcards' ? (
            <Flashcards
              onBack={() => setCurrentView('upload')}
              onNavigate={setCurrentView}
            />
          ) : (
            <Hero
              onGetStarted={() => setCurrentView('upload')}
            />
          )}
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}