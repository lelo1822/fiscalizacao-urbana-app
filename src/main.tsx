
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add polyfill for Safari and older browsers that don't support isSecureContext
if (typeof window.isSecureContext === 'undefined') {
  window.isSecureContext = window.location.protocol === 'https:';
}

createRoot(document.getElementById("root")!).render(<App />);
