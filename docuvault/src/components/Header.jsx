import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
    return (
        <div
            className="flex flex-col items-center justify-center bg-gray-700 px-6 md:px-10 lg:px-20 
                 min-h-screen bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: `url(${assets.img3})` }}
        >
            {/* Overlay for Better Text Visibility */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* --------- Header Content --------- */}
            <div className="relative z-10 text-center text-white max-w-3xl mx-auto py-10 md:py-[10vw]">
                <p className="text-6xl md:text-4xl lg:text-5xl font-semibold leading-tight">
                    DocuVault
                </p>
                <p className="text-lg md:text-2xl font-light mt-4">
                    The Digital Library for <br className="hidden sm:block" />
                    Seamless Document Accessibility
                </p>

                <div className="flex justify-center mt-12">
                    <form className="flex w-full max-w-[400px]">
                        {/* Input Field */}
                        <input
                            type="text"
                            placeholder="Search a book ..."
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-l-full 
                                        focus:outline-none focus:border-gray-200 shadow-md"
                        />

                        {/* Search Button */}
                        <button
                            className="px-4 py-2 bg-white text-gray-800 rounded-r-full cursor-pointer
                                         hover:bg-gray-800 hover:text-white transition duration-300"
                        >
                            Search
                        </button>
                    </form>
                </div>


                <a
                    href="#speciality"
                    className="ml-auto bg-white text-gray-800 px-7 py-3 rounded-full text-sm font-medium cursor-pointer
                   hover:bg-gray-800 hover:text-white transition-all duration-300 shadow-md
                   mt-10 inline-block hover:scale-105"
                >
                    Go To Library
                </a>
            </div>
        </div>
    );
};

export default Header;
