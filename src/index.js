import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global styles + animations - Game-like visual design
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
    background: linear-gradient(180deg, #1a5276 0%, #2e86ab 50%, #48b8a0 100%);
  }

  button {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    cursor: pointer;
  }

  button:active {
    transform: scale(0.93) translateY(2px) !important;
  }

  img {
    -webkit-user-drag: none;
    user-drag: none;
  }

  /* Hide scrollbar but allow scroll */
  ::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  /* ==================== ANIMATIONS ==================== */

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(25px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes popIn {
    0% { transform: scale(0.3); opacity: 0; }
    60% { transform: scale(1.15); }
    80% { transform: scale(0.95); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    40% { transform: translateY(-15px); }
    60% { transform: translateY(-8px); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }

  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    20% { transform: rotate(-8deg); }
    40% { transform: rotate(8deg); }
    60% { transform: rotate(-5deg); }
    80% { transform: rotate(5deg); }
  }

  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
    50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
  }

  @keyframes confettiDrop {
    0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(1080deg); opacity: 0; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-12px) rotate(3deg); }
    50% { transform: translateY(-5px) rotate(0deg); }
    75% { transform: translateY(8px) rotate(-3deg); }
  }

  @keyframes floatSlow {
    0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; }
    25% { transform: translateY(-20px) translateX(10px) scale(1.1); opacity: 0.8; }
    50% { transform: translateY(-35px) translateX(-5px) scale(1); opacity: 0.6; }
    75% { transform: translateY(-15px) translateX(-10px) scale(0.9); opacity: 0.7; }
  }

  @keyframes slideInRight {
    from { transform: translateX(-40px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideInLeft {
    from { transform: translateX(40px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 8px rgba(255,215,0,0.4), 0 0 20px rgba(255,215,0,0.2); }
    50% { box-shadow: 0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.4); }
  }

  @keyframes shine {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%) rotate(25deg); }
    100% { transform: translateX(100%) rotate(25deg); }
  }

  @keyframes starBurst {
    0% { transform: scale(0) rotate(0deg); opacity: 1; }
    50% { transform: scale(1.5) rotate(180deg); opacity: 0.8; }
    100% { transform: scale(0) rotate(360deg); opacity: 0; }
  }

  @keyframes rainbowGlow {
    0% { filter: hue-rotate(0deg) drop-shadow(0 0 10px currentColor); }
    100% { filter: hue-rotate(360deg) drop-shadow(0 0 15px currentColor); }
  }

  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    15% { transform: scale(1.15); }
    30% { transform: scale(1); }
    45% { transform: scale(1.1); }
  }

  @keyframes swing {
    0%, 100% { transform: rotate(0deg); transform-origin: top center; }
    25% { transform: rotate(10deg); }
    50% { transform: rotate(0deg); }
    75% { transform: rotate(-10deg); }
  }

  @keyframes backgroundMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes bubbleFloat {
    0% { transform: translateY(100vh) scale(0); opacity: 0; }
    10% { opacity: 0.6; }
    90% { opacity: 0.4; }
    100% { transform: translateY(-20vh) scale(1); opacity: 0; }
  }

  /* ==================== UTILITY CLASSES ==================== */

  .animate-fadeInUp { animation: fadeInUp 0.4s ease forwards; }
  .animate-popIn { animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
  .animate-bounce { animation: bounce 1.2s ease infinite; }
  .animate-pulse { animation: pulse 2s ease infinite; }
  .animate-wiggle { animation: wiggle 0.6s ease; }
  .animate-float { animation: float 4s ease infinite; }
  .animate-glow { animation: glowPulse 2s ease infinite; }
  .animate-heartbeat { animation: heartbeat 1.5s ease infinite; }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
