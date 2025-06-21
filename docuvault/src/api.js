import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // npm install jwt-decode
import dayjs from 'dayjs'; // npm install dayjs

// Base URL for your Django API
const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        // 'X-CSRFToken': YOUR_CSRF_TOKEN_HERE // Will be set by interceptor for safety if not using sessions for auth
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(async req => {
    const token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;

        // Check if token is expired and refresh if necessary
        const user = jwtDecode(token);
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1; // Check if token expires in less than 1 second

        if (isExpired && refresh_token) {
            try {
                // Request new access token using refresh token
                const response = await axios.post(`${baseURL}/users/token/refresh/`, {
                    refresh: refresh_token
                });
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh); // Rotate refresh token
                req.headers.Authorization = `Bearer ${response.data.access}`;
            } catch (error) {
                console.error("Token refresh failed:", error);
                // If refresh fails, clear tokens and redirect to login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                // You might want to dispatch an action or use a global state to force logout
                window.location.href = '/login'; // Redirect to login page
            }
        }
    }

    // CSRF Token handling (if you decide to use it in production)
    // For local development with CORS_ALLOW_ALL_ORIGINS = True and no @csrf_exempt,
    // Django's CSRF protection might not actively block requests from different origins.
    // However, if you remove CORS_ALLOW_ALL_ORIGINS or add specific CORS origins,
    // and remove @csrf_exempt from views, you will need to handle CSRF.
    //
    // For typical DRF + SPA setups, it's common to configure CSRF like this:
    // const csrfToken = getCookie('csrftoken'); // Function to get CSRF token from cookie
    // if (csrfToken) {
    //     req.headers['X-CSRFToken'] = csrfToken;
    // }

    return req;
}, error => {
    return Promise.reject(error);
});

// Function to get CSRF token from cookies (needed if you enable Django CSRF fully)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


export default axiosInstance;