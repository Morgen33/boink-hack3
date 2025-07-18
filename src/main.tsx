
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add global error handling
window.addEventListener('error', (event) => {
  console.error('Global Error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

console.log('main.tsx starting...');
console.log('Document ready state:', document.readyState);
console.log('User agent:', navigator.userAgent);

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
  document.body.innerHTML = '<div style="color: white; padding: 20px;">Error: Root element not found</div>';
} else {
  console.log('Root element found, creating React app...');
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('React app rendered successfully');
  } catch (error) {
    console.error('Failed to render React app:', error);
    rootElement.innerHTML = '<div style="color: white; padding: 20px;">Error loading app: ' + (error as Error).message + '</div>';
  }
}
