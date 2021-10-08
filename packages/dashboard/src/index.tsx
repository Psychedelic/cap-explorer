import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  // Strict mode checks are run in development mode only
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
