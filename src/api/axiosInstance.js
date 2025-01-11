import axios from 'axios';
import { message } from 'antd'; // Import Ant Design message component 

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: 'https://crm.techtrix.in/api', // Your backend base URL
    // baseURL: 'http://localhost:8080/api', // Your backend base URL
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 20000, // Set timeout to 20 seconds
});

// Add request interceptor to include the token in the Authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Use Bearer token
        }
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
        return response;
    },
    (error) => {
        if (error.code === 'ECONNABORTED') {
            // Customize timeout error message
            console.error('[Timeout Error] Request took too long to complete.');

            // Show timeout message using Ant Design's message component
            // message.error('Server Error! Please try again.', 5); // Display for 10 seconds

            // Optionally, use setTimeout to auto-dismiss message after 10 minutes
            setTimeout(() => {
                message.destroy(); // Manually hide the message after 10 minutes
            }, 10 * 60 * 1000); // 10 minutes in milliseconds
        }

        if (error.response) {
            // Handle different HTTP status codes
            const { status } = error.response;

            if (status === 401) {
                console.warn('Unauthorized access - clearing token and redirecting to login');
                localStorage.removeItem('authToken');
                window.location.href = '/login'; // Redirect to login page
            } else if (status === 403) {
                console.warn('Forbidden - you do not have access to this resource.');
            } else if (status === 500) {
                console.error('Server error - please try again later.');
            }
        } else if (error.request) {
            // Handle no response from server
            console.error('[No Response] The request was made but no response was received.', error.request);
        } else {
            // Handle other errors
            console.error('[Error]', error.message);
        }

        return Promise.reject(error); // Forward the error
    }
);

export default axiosInstance;
