import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api"; // IMPORT YOUR CUSTOM AXIOS INSTANCE
import { useAuth } from "../context/AuthContext"; // Import useAuth to potentially show a message if not authenticated

const Library = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null);   // Added error state
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // Use auth context

  useEffect(() => {
    // Only fetch if authenticated
    if (!isAuthenticated) {
      setLoading(false);
      setError("Please log in to view your documents.");
      return;
    }

    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use axiosInstance for authenticated request
        const res = await axiosInstance.get("/documents/"); // Correct endpoint for user's documents
        setDocuments(res.data);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
        if (err.response && err.response.status === 401) {
            setError("Session expired or not authorized. Please log in again.");
            // AuthContext should handle actual logout/redirection, but this message is for immediate feedback
        } else {
            setError("Failed to load documents. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [isAuthenticated]); // Dependency array: re-run if authentication status changes

  const handleClick = (id) => {
    navigate(`/document/${id}`);
  };

  // Render Logic for Loading/Error
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white text-gray-800">
        <p className="text-xl">Loading your documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center bg-red-100 border border-red-400 text-red-700 rounded-lg mx-auto max-w-xl mt-20">
        <p className="text-lg font-semibold mb-2">Error:</p>
        <p>{error}</p>
        <p className="text-sm mt-3">If you are not logged in, please go to the Login page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white text-gray-800 relative custom-scrollbar">
      {/* Permanent Sidebar (Filters - currently static) */}
      <div className="w-64 bg-gray-100 min-h-screen p-5 left-0 top-0 mt-20 shadow-md">
        <h2 className="text-lg font-semibold mb-4">Filter</h2>
        <ul className="flex flex-col space-y-3">
          {['Author', 'Education Level', 'Language', 'Publication'].map((item, index) => (
            <li
              key={index}
              className="p-3 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-600 cursor-pointer transition"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Scrollable Domains Bar (currently static) */}
      <div className="fixed top-[80px] left-64 right-0 bg-white z-20 px-4 shadow-md custom-scrollbar">
        <ul className="flex gap-5 whitespace-nowrap p-3">
          {[
            "All Domains",
            "Artificial Intelligence",
            "Cybersecurity",
            "Cloud Computing",
            "Blockchain Technology",
            "Quantum Computing",
            "Internet of Things",
            "Data Science",
            "Web Development",
          ].map((item, index) => (
            <li
              key={index}
              className="px-5 py-3 font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-md hover:text-white hover:bg-gray-600 cursor-pointer transition"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 mt-40 p-6">
        <h2 className="text-2xl font-semibold">Your Uploaded Documents</h2>
        <p className="text-gray-600 mt-2">
          {documents.length === 0 ? "You haven't uploaded any documents yet." : "Browse and find your uploaded documents."}
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleClick(doc.id)}
              className="bg-gray-100 hover:bg-gray-800 text-gray-800 hover:text-white hover:cursor-pointer transition-all duration-300 p-4 rounded-lg shadow-lg"
            >
              <p className="text-xl font-semibold">{doc.title}</p>
              {doc.author_name && <p className="text-sm mt-1">Author: <span className="font-medium">{doc.author_name}</span></p>}
              <p className="text-sm mt-1">Domain: <span className="font-medium">{doc.domain}</span></p>
              {doc.description && <p className="text-sm mt-1">Description: <span className="font-medium">{doc.description.substring(0, 100)}{doc.description.length > 100 ? '...' : ''}</span></p>}
              {doc.uploader && doc.uploader.full_name && <p className="text-sm mt-1">Uploaded by: <span className="font-medium">{doc.uploader.full_name}</span></p>}
              <p className="text-sm mt-1">Uploaded on: <span className="font-medium">{new Date(doc.created_at).toLocaleDateString()}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;