import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

console.log('[debug] index.tsx: process.env.NODE_ENV', process.env.NODE_ENV);

ReactDOM.render(
  // Strict mode checks are run in development mode only
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
