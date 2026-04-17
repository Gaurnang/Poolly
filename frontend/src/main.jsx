import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0f1623',
            color: '#e8edf8',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13.5px',
            fontWeight: '500',
            padding: '12px 16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#0f1623' },
            style: { borderLeft: '3px solid #10b981' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0f1623' },
            style: { borderLeft: '3px solid #ef4444' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
