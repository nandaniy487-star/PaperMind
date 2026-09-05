import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import UploadPaper from './components/UploadPaper';
import ChatPaper from './components/ChatPaper';
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
            />
          ) : (
            <ChatPaper
              onBack={() => setCurrentView('upload')}
            />
          )}
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}