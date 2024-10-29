import axiosInstance from './axiosInstance';

const userApi = {
    getAllusers: () => {
        return axiosInstance.get('/users/all');
    },
    // rem
    getuserById: (id) => {
        return axiosInstance.get(`/users/get/${id}`);
    },
    
    createuser: (userData) => {
        return axiosInstance.post('/users/add', userData);
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