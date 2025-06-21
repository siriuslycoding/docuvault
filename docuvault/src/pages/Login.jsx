import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ADD THIS LINE
import { useAuth } from '../context/AuthContext'; // ADD THIS LINE

const Login = () => {
    const navigate = useNavigate(); // ADD THIS LINE
    const { loginUser, registerUser, loading: authLoading, isAuthenticated } = useAuth(); // ADD THIS LINE

    const [login, setLogin] = useState(true);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // For signup
    const [loading, setLoading] = useState(false); // For API call loading state (local to form)
    const [errorMessage, setErrorMessage] = useState(null); // For API call errors or validation errors

    // Redirect if already authenticated
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/library'); // Or your dashboard page
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null); // Clear previous errors
        setLoading(true); // Start local form loading

        // Basic client-side validation
        if (!email || !password || (!login && (!fullName || !confirmPassword))) {
            setErrorMessage("All fields are required.");
            setLoading(false);
            return;
        }

        if (!login && password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            setLoading(false);
            return;
        }

        let result;
        if (login) {
            result = await loginUser(email, password);
        } else {
            result = await registerUser(fullName, email, password, confirmPassword);
        }

        if (result.success) {
            // Context handles navigation on success, so no need here.
            // setSuccessMessage(login ? "Login successful!" : "Account created successfully!");
        } else {
            // Handle errors from AuthContext
            if (login) {
                setErrorMessage(result.error || "An unexpected error occurred during login.");
            } else {
                // For registration, result.error might be an object with field errors
                if (typeof result.error === 'object') {
                    const errorMessages = Object.values(result.error).flat();
                    setErrorMessage(errorMessages.join(' | '));
                } else {
                    setErrorMessage(result.error || "An unexpected error occurred during registration.");
                }
            }
        }
        setLoading(false); // End local form loading
    };

    const overallLoading = loading || authLoading; // Combine local form loading with context's initial auth check loading

    return (
        <form onSubmit={handleSubmit} className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-gray-800 text-white p-8 rounded-xl shadow-lg border border-gray-700">

                {/* Heading */}
                <h2 className="text-3xl font-semibold text-center">
                    {login ? "Login" : "Sign Up"}
                </h2>
                <p className="text-gray-400 text-center mt-2">
                    {login ? "Login to your account" : "Create your account to get started"}
                </p>

                {/* Error Message Display */}
                {errorMessage && (
                    <div className="bg-red-500 text-white text-center p-2 rounded mt-4">
                        {errorMessage}
                    </div>
                )}

                {/* Name Field (only for Sign Up) */}
                {!login && (
                    <div className="w-full mt-6">
                        <label htmlFor="fullName" className="text-gray-300 text-sm">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            className="w-full mt-2 p-3 text-gray-800 bg-gray-100 focus:bg-white rounded-lg
                                       focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="Enter your full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={overallLoading}
                        />
                    </div>
                )}

                {/* Email Field */}
                <div className="w-full mt-4">
                    <label htmlFor="email" className="text-gray-300 text-sm">Email ID</label>
                    <input
                        type="email"
                        id="email"
                        className="w-full mt-2 p-3 text-gray-800 bg-gray-100 focus:bg-white rounded-lg
                                   focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="abc@xyz.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={overallLoading}
                    />
                </div>

                {/* Password Field */}
                <div className="w-full mt-4">
                    <label htmlFor="password" className="text-gray-300 text-sm">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="w-full mt-2 p-3 text-gray-800 bg-gray-100 focus:bg-white rounded-lg
                                   focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={overallLoading}
                    />
                </div>

                {/* Confirm Password Field (only for Sign Up) */}
                {!login && (
                    <div className="w-full mt-4">
                        <label htmlFor="confirmPassword" className="text-gray-300 text-sm">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="w-full mt-2 p-3 text-gray-800 bg-gray-100 focus:bg-white rounded-lg
                                       focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={overallLoading}
                        />
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-3 rounded-lg mt-6 font-semibold
                               hover:bg-blue-600 transition duration-300 cursor-pointer"
                    disabled={overallLoading}
                >
                    {overallLoading ? (login ? "Logging in..." : "Creating...") : (login ? "Login" : "Create Account")}
                </button>

                {/* Toggle Login/Signup */}
                <p className="text-center text-gray-400 mt-4 text-sm">
                    {login
                        ? "Haven't created an account yet? "
                        : "Already have an account? "}
                    <button
                        type='button'
                        onClick={() => {
                            setLogin(!login);
                            // Clear form fields and errors when toggling
                            setFullName('');
                            setEmail('');
                            setPassword('');
                            setConfirmPassword('');
                            setErrorMessage(null);
                        }}
                        className="text-blue-400 hover:underline cursor-pointer"
                        disabled={overallLoading}
                    >
                        {login ? "Create Account" : "Log in"}
                    </button>
                </p>
            </div>
        </form>
    );
};

export default Login;