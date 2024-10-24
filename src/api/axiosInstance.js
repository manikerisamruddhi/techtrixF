import axios from 'axios';

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api', // Your backend base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add JWT Token to requests if available
// axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');  // Assuming the token is stored in localStorage
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

export default axiosInstance;
