import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'; // ADD Navigate
import Footer from './components/Footer';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Domains from './pages/Domains';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Library from './pages/Library';
import Search from './components/Search';
import DocumentDetails from './pages/DocumentDetails';
import { useAuth } from './context/AuthContext'; // ADD THIS IMPORT

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Optionally render a loading spinner or placeholder while checking auth status
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-140px)] text-xl text-gray-700">
            Checking authentication...
        </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children (the protected component)
  return children;
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/domains' element={<Domains />} />
        <Route path='/login' element={<Login />} />
        {/* Note: If Search component doesn't inherently need auth, keep it public */}
        <Route path='/search' element={<Search />} /> 

        {/* Protected Routes (requires authentication) */}
        <Route 
          path='/upload' 
          element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          } 
        />
        <Route 
          path='/library' 
          element={
            <PrivateRoute>
              <Library />
            </PrivateRoute>
          } 
        />
        <Route 
          path='/document/:id' 
          element={
            <PrivateRoute>
              <DocumentDetails />
            </PrivateRoute>
          } 
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;