import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // ADD THIS IMPORT
import { AuthProvider } from './context/AuthContext.jsx'; // ADD THIS IMPORT

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* WRAP WITH BROWSER ROUTER */}
      <AuthProvider> {/* WRAP WITH AUTH PROVIDER */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);