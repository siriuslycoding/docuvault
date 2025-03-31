import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50 px-6 py-3 flex items-center justify-between">
      {/* Logo Section */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
        <img
          className="w-14 h-14 rounded-full"
          src={assets.img1}
          alt="Logo"
        />
        <p className="text-2xl font-bold text-gray-700">DocuVault</p>
      </div>

      {/* Centered Navigation Links */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <ul className="flex items-center gap-8 text-lg font-medium text-gray-700">
          {["Library", "Domains", "Upload"].map((item, index) => (
            <li
              key={index}
              onClick={() => navigate(`/${item.toLowerCase()}`)}
              className="cursor-pointer relative transition-all duration-300 ease-in-out
                         after:content-[''] after:absolute after:left-0 after:bottom-[-3px] after:w-0 
                         after:h-[2px] after:bg-gray-800 after:transition-all after:duration-300 
                         after:translate-y-[2px] hover:after:w-full">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => navigate("/login")}
        className="ml-auto bg-gray-800 text-white px-7 py-3 rounded-full text-sm font-medium cursor-pointer
                   hover:bg-gray-300 hover:text-gray-800 transition-all duration-300 shadow-md"
      >
        Login
      </button>

    </div>
  );
};

export default Navbar;
