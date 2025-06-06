import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DocumentDetails = () => {
    const { id } = useParams(); // get document ID from URL
    const [document, setDocument] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/documents/`)
            .then((res) => {
                const doc = res.data.find((doc) => doc.id === parseInt(id));
                setDocument(doc);
            })
            .catch((err) => console.error("Error fetching document:", err));
    }, [id]);

    if (!document) {
        return <div className="p-10">Loading document...</div>;
    }

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-4">{document.title}</h1>
            <p className="mb-2">
                <strong>Description:</strong> {document.description}
            </p>
            <p className="mb-2">
                <strong>Domain:</strong> {document.domain}
            </p>
            <p className="mb-6">
                <strong>Uploaded on:</strong>{" "}
                {new Date(document.created_at).toLocaleDateString()}
            </p>

            <div className="mt-6">
                <iframe
                    src={`http://localhost:8000${document.file}`}
                    title="PDF Viewer"
                    width="100%"
                    height="800px"
                    className="border rounded-lg"
                />
            </div>
        </div>
    );
};

export default DocumentDetails;
