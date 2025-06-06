import { useState } from "react";
import axios from 'axios';

const Upload = () => {
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    date: "",
    document: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, document: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.name);
    formDataToSend.append("description", formData.author);
    formDataToSend.append("domain", formData.date);
    formDataToSend.append("file", formData.document);

    try {
      const res = await axios.post("http://localhost:8000/api/upload/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Document uploaded successfully!");
    } catch (err) {
      if (err.response) {
        console.error("Upload error:", err.response.data);
      } else {
        console.error("Unexpected error:", err.message);
      }
      alert("Error uploading document.");
    }
  };




  return (
    <div className="bg-gray-800 py-10 px-10 md:px-12 lg:px-20 mb-10 mx-auto mt-30 max-w-xl justify-center backdrop-blur-lg rounded-lg shadow-md text-gray-100">
      <div className="bg-gray-100 py-10 px-8 rounded-lg shadow-lg">
        <h2 className="text-center font-bold text-3xl text-gray-800 mb-5">Upload Document</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg text-gray-800">Enter Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-black"
              required
            />
          </div>

          <div>
            <label className="block text-lg text-gray-800">Enter Author Name</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-black"
              required
            />
          </div>

          <div>
            <label className="block text-lg text-gray-800">Enter Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-black"
              required
            />
          </div>

          <div>
            <label className="block text-lg text-gray-800">Upload Document</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white text-lg font-bold py-3 rounded-md hover:bg-gray-700 transition duration-300"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
