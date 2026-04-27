import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Reset browser defaults
const style = document.createElement('style');
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; }
  a { color: inherit; }
  .leaflet-popup-content-wrapper { border-radius: 8px !important; box-shadow: 0 2px 12px rgba(0,0,0,0.15) !important; }
  .leaflet-popup-content { margin: 14px 16px !important; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-thumb { background: #dadce0; border-radius: 4px; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
