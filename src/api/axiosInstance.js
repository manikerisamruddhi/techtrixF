import axios from 'axios';

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: 'https://crm.techtrix.in/api', // Your backend base URL
    // baseURL: '/api', // Your backend base URL
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 20000, // Set timeout 
});

export default axiosInstance;
