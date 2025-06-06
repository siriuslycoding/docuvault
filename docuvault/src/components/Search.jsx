import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Search = () => {
  const [answer, setAnswer] = useState('');
  const [results, setResults] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    if (query) {
      fetch('http://localhost:8000/api/search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      })
        .then(res => res.json())
        .then(data => {
          setAnswer(data.answer);
          setResults(data.relevant_chunks);
        })
        .catch(err => console.error(err));
    }
  }, [query]);

  return (
    <div className="mt-15 p-6">
      <h2 className="text-xl font-bold mb-4">Search Results for "{query}"</h2>
      
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">🧠 AI Answer:</h3>
        <p>{answer}</p>
      </div>

      <h3 className="text-lg font-semibold mb-2">📄 Relevant Documents:</h3>
      <ul>
        {results.map((res, idx) => (
          <li key={idx} className="mb-4 p-4 bg-gray-100 rounded shadow-sm">
            <strong>{res.document_title}</strong>
            <p className="text-sm text-gray-700 mt-2">{res.chunk_content.slice(0, 300)}...</p>
            <p className="text-xs text-gray-500 mt-1">Similarity: {res.similarity.toFixed(3)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
