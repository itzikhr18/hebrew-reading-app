import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global styles + animations
const style = document.createElement('style');
style.textContent = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
    touch-action: manipulation;
  }

  body {
    font-family: 'Rubik', 'Heebo', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #FFF8E7;
  }

  button {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  button:active {
    transform: scale(0.93) !important;
  }

  img {
    -webkit-user-drag: none;
    user-drag: none;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes popIn {
    0% { transform: scale(0.5); opacity: 0; }
    70% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-5deg); }
    75% { transform: rotate(5deg); }
  }

  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
    50% { opacity: 1; transform: scale(1) rotate(180deg); }
  }

  @keyframes confettiDrop {
    0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    33% { transform: translateY(-8px) rotate(2deg); }
    66% { transform: translateY(4px) rotate(-2deg); }
  }

  @keyframes slideInRight {
    from { transform: translateX(-30px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 5px rgba(255,215,0,0.3); }
    50% { box-shadow: 0 0 20px rgba(255,215,0,0.6); }
  }

  .animate-fadeInUp { animation: fadeInUp 0.4s ease forwards; }
  .animate-popIn { animation: popIn 0.4s ease forwards; }
  .animate-bounce { animation: bounce 1s ease infinite; }
  .animate-pulse { animation: pulse 2s ease infinite; }
  .animate-wiggle { animation: wiggle 0.5s ease; }
  .animate-float { animation: float 3s ease infinite; }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
