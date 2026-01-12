// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';

import './src/index.css'; // OK si index.tsx está en raíz

import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
