import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Added Link to imports

const Footer = () => {
  const navigate = useNavigate(); // Still useful for the logo click if needed, or other non-Link navigations

  return (
    <div className="bg-gray-800 py-10 px-6 md:px-12 lg:px-20">
      {/* Footer Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left Section - Branding */}
        <div>
          <h1 className="text-3xl font-bold mb-3 text-white">DocuVault</h1>
          <p className="text-lg font-light text-gray-300">
            The Digital Library for Seamless Document Accessibility
          </p>
        </div>

        {/* Center Section - Navigation Links */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-white">Quick Links</h2>
          <ul className="space-y-2"> {/* Removed text-gray-300 from ul as Link will have it */}
            <li>
              <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
            </li>
            <li>
              <Link to="/library" className="text-gray-300 hover:text-white transition">Library</Link>
            </li>
            <li>
              <Link to="/domains" className="text-gray-300 hover:text-white transition">Domains</Link>
            </li>
            <li>
              <Link to="/upload" className="text-gray-300 hover:text-white transition">Upload</Link>
            </li>
          </ul>
        </div>

        {/* Right Section - Contact Info */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-white">Contact Us</h2>
          <ul className="space-y-2"> {/* Removed text-gray-300 from ul as Link/a will have it */}
            <li>
              <Link to="/faqs" className="text-gray-300 hover:text-white transition">FAQs</Link>
            </li>
            <li>Phone: <a href="tel:+918484022348" className="text-gray-300 hover:text-white transition">+91 84840 22348</a></li>
            <li>Email: <a href="mailto:harmpbl@gmail.com" className="text-gray-300 hover:text-white transition">harmpbl@gmail.com</a></li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom Line */}
      <div className="text-center text-gray-400 text-sm mt-10 border-t border-gray-600 pt-4">
        © 2025 DocuVault. All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;