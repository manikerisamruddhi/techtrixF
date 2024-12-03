import axios from 'axios';

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api', // Your backend base URL
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Optional: Add timeout to handle slow requests
});

// Add request interceptor to include the token in the Authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Use Bearer token
        }
        // console.log(`[Request] ${config.method.toUpperCase()} ${config.url}`, config); // Debugging
        return config;
    },
    (error) => {
        console.error('[Request Error]', error); // Log request error
        return Promise.reject(error); // Handle request errors
    }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // console.log('[Response]', response); // Log successful responses
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle different HTTP status codes
            const { status } = error.response;
            console.error(`[Response Error] ${status}:`, error.response.data);

            if (status === 401) {
                // Unauthorized: token might be invalid or expired
                console.warn('Unauthorized access - clearing token and redirecting to login');
                localStorage.removeItem('authToken');
                window.location.href = '/login'; // Redirect to login page
            } else if (status === 403) {
                // console.warn('Forbidden - you do not have access to this resource.');
            } else if (status === 500) {
                // console.error('Server error - please try again later.');
            }
        } else if (error.request) {
            // Handle no response from server
            // console.error('[No Response] The request was made but no response was received.', error.request);
        } else {
            // Handle other errors
            // console.error('[Error]', error.message);
        }

        return Promise.reject(error); // Forward the error
    }
);

export default axiosInstance;
