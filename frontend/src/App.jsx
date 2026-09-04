import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import './App.css';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
