import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import './index.css';

// The hosted address counts a page view through Vercel Web Analytics, so a visit that
// arrives from the portfolio shows up there. The app installed on her home screen never
// loads it: no network call and no tracking, exactly as promised.
const installed =
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const host = document.getElementById('root');
if (host) {
  createRoot(host).render(
    <StrictMode>
      <App />
      {installed ? null : <Analytics />}
    </StrictMode>,
  );
}
