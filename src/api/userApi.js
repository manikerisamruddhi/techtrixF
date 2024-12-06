import axiosInstance from './axiosInstance';
import axiosInstance2 from './axiosInstancewithoutTocken';

const userApi = {
    getAllusers: () => {
        return axiosInstance.get('/users/all');
    },
    // rem
    getUserById: (id) => {
        return axiosInstance.get(`/users/get/${id}`);
    },
    
    createuser: (userData) => {
        return axiosInstance2.post('/users/add', userData);
    },
    
    updateuser: (id, userData) => {
        return axiosInstance.put(`/users/update/${id}`, userData);
    },

    getuserByRole: (role) => {
        return axiosInstance.get(`/users/get/role/${role}`);
    },
    
    deleteuser: (id) => {
        return axiosInstance.delete(`/users/${id}`);
    },
};

export default userApi;