import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Search = () => {
  const [answer, setAnswer] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false); // Added loading state
  const [error, setError] = useState(null);   // Added error state
  const location = useLocation();

  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    if (query) {
      setLoading(true); // Start loading
      setError(null);   // Clear previous errors

      fetch('http://localhost:8000/api/search/', { // Consider environment variable for URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          setAnswer(data.answer || 'No AI answer found.'); // Default for empty answer
          setResults(data.relevant_chunks || []); // Default for empty chunks
          setLoading(false); // End loading
        })
        .catch(err => {
          console.error("Error fetching search results:", err);
          setError("Failed to fetch search results. Please try again."); // Set user-friendly error message
          setLoading(false); // End loading even on error
        });
    } else {
      // Clear results if query becomes empty (e.g., navigating away from search)
      setAnswer('');
      setResults([]);
      setLoading(false);
      setError(null);
    }
  }, [query]);

  return (
    <div className="mt-16 p-6 md:p-8 lg:p-10 max-w-5xl mx-auto"> {/* Adjusted mt-15 to mt-16 for standard tailwind */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Search Results for "<span className="text-blue-600">{query}</span>"
      </h2>
      
      {loading && (
        <div className="text-center py-8 text-gray-600">
          <p>Loading search results...</p>
          {/* You can add a spinner icon here */}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">🧠 AI Answer:</h3>
            <p className="text-gray-800 leading-relaxed">
              {answer || (query ? "No AI answer found for this query." : "Please enter a search query.")}
            </p>
          </div>

          <h3 className="text-xl font-semibold mb-4 text-gray-700">📄 Relevant Documents:</h3>
          {results.length > 0 ? (
            <ul>
              {results.map((res) => (
                // Assuming 'id' or 'chunk_id' exists on your 'res' object from backend
                // If not, ask backend to provide, or use a unique ID generator
                <li key={res.id || res.document_id + '_' + res.chunk_content.slice(0, 10)} className="mb-4 p-5 bg-gray-50 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <h4 className="text-md font-bold text-blue-700">{res.document_title}</h4>
                  <p className="text-sm text-gray-700 mt-2 leading-snug">{res.chunk_content.slice(0, 300)}{res.chunk_content.length > 300 ? '...' : ''}</p>
                  <p className="text-xs text-gray-500 mt-2">Similarity: {res.similarity ? res.similarity.toFixed(3) : 'N/A'}</p>
                  {/* Optional: Add a "Read More" or "View Document" link/button here */}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 py-4 text-center">
              {query && !loading ? "No relevant documents found for your query." : "Enter a query to see documents."}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Search;