import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import UploadPaper from './components/UploadPaper';
import ChatPaper from './components/ChatPaper';
import StudyNotes from './components/StudyNotes';
import Methodology from './components/Methodology';
import ResultsConclusion from './components/ResultsConclusion';
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
              onResultsConclusion={() =>
                setCurrentView('results-conclusion')
              }
            />

          ) : currentView === 'chat' ? (
            <ChatPaper
              onBack={() => setCurrentView('upload')}
            />

          ) : currentView === 'study-notes' ? (
            <StudyNotes
              onBack={() => setCurrentView('upload')}
            />

          ) : currentView === 'methodology' ? (
            <Methodology
              onBack={() => setCurrentView('upload')}
            />

          ) : currentView === 'results-conclusion' ? (
            <ResultsConclusion
              onBack={() => setCurrentView('upload')}
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