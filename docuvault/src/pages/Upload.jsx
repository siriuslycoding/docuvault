import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api'; // IMPORT YOUR CUSTOM AXIOS INSTANCE

const Upload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "", // ADDED THIS FIELD
    author_name: "",
    domain: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Basic client-side validation
    if (!formData.title || !formData.domain || !formData.file) { // author_name & description are optional based on model
      setError("Title, Domain, and File are required.");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description); // Append description
    formDataToSend.append("author_name", formData.author_name);
    formDataToSend.append("domain", formData.domain);
    formDataToSend.append("file", formData.file);

    try {
      // Corrected endpoint to /api/documents/upload/ as per backend urls.py
      const res = await axiosInstance.post(`/documents/upload/`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for FormData
        },
      });

      setSuccess(true);
      // Clear form after successful upload
      setFormData({
        title: "",
        description: "",
        author_name: "",
        domain: "",
        file: null,
      });
      // Optionally navigate away or provide a link to the document
      // navigate(`/document/${res.data.document_id}`); // Assuming backend returns document_id
      
    } catch (err) {
      if (err.response) {
        console.error("Upload error:", err.response.data);
        // More specific error handling for DRF validation errors
        if (err.response.data.detail) {
             setError(err.response.data.detail); // e.g., "Authentication credentials were not provided."
        } else if (err.response.data) {
            const errorMessages = Object.entries(err.response.data)
                .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                .join(' | ');
            setError(errorMessages || "Failed to upload document. Please check your input.");
        }
      } else {
        console.error("Unexpected error:", err.message);
        setError("Network error or server unavailable. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-gray-800 py-10 px-10 md:px-12 lg:px-20 mb-10 mx-auto mt-20 max-w-xl justify-center backdrop-blur-lg rounded-lg shadow-md text-gray-100">
      <div className="bg-gray-100 py-10 px-8 rounded-lg shadow-lg">
        <h2 className="text-center font-bold text-3xl text-gray-800 mb-5">Upload Document</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Success! </strong>
              <span className="block sm:inline">Document uploaded successfully.</span>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-lg text-gray-800">Document Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-black"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-lg text-gray-800">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-black h-24"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="author_name" className="block text-lg text-gray-800">Author Name (Optional)</label>
            <input
              type="text"
              id="author_name"
              name="author_name"
              value={formData.author_name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-black"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="domain" className="block text-lg text-gray-800">Domain (e.g., AI, Cybersecurity)</label>
            <input
              type="text"
              id="domain"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-black"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="file" className="block text-lg text-gray-800">Upload Document (PDF)</label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md text-black"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white text-lg font-bold py-3 rounded-md hover:bg-gray-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;