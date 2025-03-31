import React, { useState } from 'react';

const Login = () => {
    const [login, setLogin] = useState(true);

    return (
        <form className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-gray-800 text-white p-8 rounded-xl shadow-lg border border-gray-700">
                
                {/* Heading */}
                <h2 className="text-3xl font-semibold text-center">
                    {login ? "Login" : "Sign Up"}
                </h2>
                <p className="text-gray-400 text-center mt-2">
                    {login ? "Login to your account" : "Create your account to get started"}
                </p>

                {/* Name Field (only for Sign Up) */}
                {!login && (
                    <div className="w-full mt-6">
                        <label className="text-gray-300 text-sm">Full Name</label>
                        <input
                            type="text"
                            className="w-full mt-2 p-3 text-gray-800 bg-gray-100 focus:bg-white rounded-lg 
                                       focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="Enter your full name"
                        />
                    </div>
                )}

                {/* Email Field */}
                <div className="w-full mt-4">
                    <label className="text-gray-300 text-sm">Email ID</label>
                    <input
                        type="email"
                        className="w-full mt-2 p-3 text-gray-800 bg-gray-100 focus:bg-white rounded-lg 
                                   focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="abc@xyz.com"
                    />
                </div>

                {/* Password Field */}
                <div className="w-full mt-4">
                    <label className="text-gray-300 text-sm">Password</label>
                    <input
                        type="password"
                        className="w-full mt-2 p-3 text-gray-800 bg-gray-100 focus:bg-white rounded-lg 
                                   focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="Enter your password"
                    />
                </div>

                {/* Submit Button */}
                <button
                    className="w-full bg-blue-500 text-white p-3 rounded-lg mt-6 font-semibold 
                               hover:bg-blue-600 transition duration-300 cursor-pointer"
                >
                    {login ? "Login" : "Create Account"}
                </button>

                {/* Toggle Login/Signup */}
                <p className="text-center text-gray-400 mt-4 text-sm">
                    {login
                        ? "Haven't created an account yet? "
                        : "Already have an account? "}
                    <button
                        type='button'
                        onClick={() => setLogin(!login)}
                        className="text-blue-400 hover:underline cursor-pointer"
                    >
                        {login ? "Create Account" : "Log in"}
                    </button>
                </p>
            </div>
        </form>
    );
};

export default Login;
