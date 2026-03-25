import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerServiceWorker } from './utils/registerSW'

// Register service worker for PWA support (production only)
if (import.meta.env.PROD) {
  registerServiceWorker();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
