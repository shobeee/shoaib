import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login'; // Import Login component
import Home from './Home'; // Import Home component
import ProtectedRoute from './Protected'; // Import the ProtectedRoute component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> {/* Login page */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        /> {/* Protected Home page */}
      </Routes>
    </Router>
  </React.StrictMode>
);
