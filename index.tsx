// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';

import './src/index.css';
import App from './App';

const migrateLegacyHashUrl = () => {
  const { hash } = window.location;

  if (!hash || !hash.startsWith('#/')) return;

  const legacyPath = hash.slice(1); // "#/menu" -> "/menu"
  const [pathPart, queryPart] = legacyPath.split('?');
  const nextUrl = queryPart ? `${pathPart}?${queryPart}` : pathPart;

  window.history.replaceState({}, '', nextUrl);
};

migrateLegacyHashUrl();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);