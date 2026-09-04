import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import UploadPaper from './components/UploadPaper';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'upload'

  return (
    <ThemeProvider>
      <div className="app-shell">
        <Navbar currentView={currentView} onNavigate={setCurrentView} />
        <main className="main-content">
          {currentView === 'landing' ? (
            <>
              <Hero onGetStarted={() => setCurrentView('upload')} />
              <Features />
            </>
          ) : (
            <UploadPaper onBack={() => setCurrentView('landing')} />
          )}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
