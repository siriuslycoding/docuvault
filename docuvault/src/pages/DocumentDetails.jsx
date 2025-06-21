import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api"; // IMPORT YOUR CUSTOM AXIOS INSTANCE
import { useAuth } from "../context/AuthContext"; // Import useAuth to potentially show a message if not authenticated

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const DocumentDetails = () => {
    const { id } = useParams();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth(); // Use auth context

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            setError("Please log in to view document details.");
            return;
        }

        if (!id) {
            setError("No document ID provided in URL.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setDocument(null);

        const fetchDocumentDetails = async () => {
            try {
                // Use axiosInstance for authenticated request
                const res = await axiosInstance.get(`/documents/${id}/`);
                setDocument(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching document:", err);
                if (err.response) {
                    if (err.response.status === 404) {
                        setError("Document not found.");
                    } else if (err.response.status === 401 || err.response.status === 403) {
                         setError("You are not authorized to view this document. Please log in or check permissions.");
                    } else {
                        setError(err.response.data.detail || "Failed to load document details. Please try again later.");
                    }
                } else {
                    setError("Network error or server unavailable. Please try again.");
                }
                setLoading(false);
            }
        };

        fetchDocumentDetails();
    }, [id, isAuthenticated]); // Re-run effect if ID or authentication status changes

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-xl text-gray-700">Loading document details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center bg-red-100 border border-red-400 text-red-700 rounded-lg mx-auto max-w-xl mt-10">
                <p className="text-lg font-semibold mb-2">Error:</p>
                <p>{error}</p>
                <p className="text-sm mt-3">Please check the document ID or your network connection.</p>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="p-10 text-center bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg mx-auto max-w-xl mt-10">
                <p className="text-lg font-semibold mb-2">Document Not Found</p>
                <p>The document you are looking for does not exist or is unavailable.</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 lg:p-12 max-w-6xl mx-auto bg-white shadow-lg rounded-lg mt-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{document.title}</h1>
            
            {document.author_name && (
                 <p className="mb-2 text-gray-700">
                    <strong>Author:</strong> {document.author_name}
                </p>
            )}

            <p className="mb-2 text-gray-700">
                <strong>Description:</strong> {document.description || 'N/A'}
            </p>
            <p className="mb-2 text-gray-700">
                <strong>Domain:</strong> {document.domain || 'N/A'}
            </p>
            <p className="mb-6 text-gray-700">
                <strong>Uploaded by:</strong> {document.uploader ? (document.uploader.full_name || document.uploader.email) : 'N/A'}
            </p>
            <p className="mb-6 text-gray-700">
                <strong>Uploaded on:</strong>{" "}
                {document.created_at ? new Date(document.created_at).toLocaleDateString() : 'N/A'}
            </p>

            <div className="mt-8 border border-gray-300 rounded-lg overflow-hidden">
                {document.file ? (
                    <iframe
                        src={`${API_BASE_URL}${document.file}`}
                        title={`PDF Viewer for ${document.title}`}
                        width="100%"
                        height="800px"
                        className="w-full h-[800px] border-none"
                    />
                ) : (
                    <div className="text-center py-20 text-red-600">
                        <p>No file available for this document.</p>
                    </div>
                )}
            </div>

            {/* Optional: Display chunks if you want to. Ensure backend DocumentSerializer includes 'chunks' */}
            {/* {document.chunks && document.chunks.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Document Chunks</h2>
                    <div className="space-y-4">
                        {document.chunks.map(chunk => (
                            <div key={chunk.id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                                <p className="text-gray-800 text-sm">{chunk.content}</p>
                                <p className="text-gray-500 text-xs mt-2">Chunk created: {new Date(chunk.created_at).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default DocumentDetails;