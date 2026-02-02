import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global styles
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
    background: #f5f5f5;
  }

  button {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  button:active {
    transform: scale(0.95);
  }

  img {
    -webkit-user-drag: none;
    user-drag: none;
  }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
