import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Ensure you have jwt-decode installed (npm install jwt-decode)
import axiosInstance from '../api'; // Your custom axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem('access_token') && localStorage.getItem('refresh_token')
            ? {
                access: localStorage.getItem('access_token'),
                refresh: localStorage.getItem('refresh_token')
              }
            : null
    );

    const [user, setUser] = useState(() =>
        localStorage.getItem('access_token')
            ? jwtDecode(localStorage.getItem('access_token'))
            : null
    );

    const [loading, setLoading] = useState(true); // Initial loading state for checking token validity

    // Function to get user profile (e.g., full_name)
    const getUserProfile = async () => {
        try {
            const response = await axiosInstance.get('/users/me/');
            setUser(prevUser => ({
                ...prevUser, // Keep existing token claims
                full_name: response.data.full_name,
                email: response.data.email,
                // Add any other profile details you want to store in context
            }));
            localStorage.setItem('user_full_name', response.data.full_name || response.data.email); // Store for quick access
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            // If fetching profile fails, it might mean token is invalid or user doesn't exist (unlikely)
            // Consider logging out in this scenario
            logoutUser();
        }
    };

    const loginUser = async (email, password) => {
        setLoading(true); // Start loading for login process
        try {
            const response = await axiosInstance.post('/users/token/', {
                email,
                password
            });
            const data = response.data;

            if (data.access && data.refresh) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                setAuthTokens(data);

                const decodedUser = jwtDecode(data.access);
                setUser(decodedUser); // Set basic user info from token
                // Fetch full user profile after setting basic token info
                await getUserProfile();

                setLoading(false); // End loading
                navigate('/library'); // Navigate to library or dashboard
                return { success: true };
            }
        } catch (error) {
            setLoading(false); // End loading
            console.error('Login error:', error.response?.data || error);
            return { success: false, error: error.response?.data?.detail || 'Something went wrong during login.' };
        }
    };

    const registerUser = async (full_name, email, password, password2) => {
        setLoading(true); // Start loading for registration process
        try {
            const response = await axiosInstance.post('/users/register/', {
                full_name,
                email,
                password,
                password2
            });
            const data = response.data;

            if (response.status === 201) {
                // After successful registration, automatically log them in
                const loginResult = await loginUser(email, password);
                setLoading(false); // End loading
                return loginResult; // Return login result (success/error)
            }
        } catch (error) {
            setLoading(false); // End loading
            console.error('Registration error:', error.response?.data || error);
            return { success: false, error: error.response?.data }; // Return detailed error for form display
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_full_name'); // Clear stored full name
        navigate('/login'); // Redirect to login page
    };

    // Initial check and profile fetch on app load
    useEffect(() => {
        if (authTokens) {
            // Validate token on initial load if present
            const decodedUser = jwtDecode(authTokens.access);
            if (dayjs.unix(decodedUser.exp).diff(dayjs()) < 1) {
                // Token already expired on load, force logout
                logoutUser();
            } else {
                // Token is valid, fetch user profile
                getUserProfile();
            }
        }
        setLoading(false); // Set loading to false after initial checks
    }, [authTokens]); // Only re-run if authTokens change

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
        registerUser,
        loading, // Expose loading state
        isAuthenticated: !!authTokens // Convenience flag
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children} {/* Don't render children until initial loading is done */}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
