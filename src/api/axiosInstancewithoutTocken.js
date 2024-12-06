import axios from 'axios';

const axiosInstance2 = axios.create({
    baseURL: 'http://localhost:8080/api', // Your backend base URL
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Optional: Add timeout to handle slow requests
});

export default axiosInstance2;