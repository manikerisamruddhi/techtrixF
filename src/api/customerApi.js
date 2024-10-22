import axiosInstance from './axiosInstance';

const customerApi = {
    getAllCustomers: () => {
        return axiosInstance.get('/customers/all');
    },
    getCustomerById: (id) => {
        return axiosInstance.get(`/customers/get/${id}`);
    },
    createCustomer: (customerData) => {
        return axiosInstance.post('/customers/add', customerData);
    },
    updateCustomer: (id, customerData) => {
        return axiosInstance.put(`/customers/update/${id}`, customerData);
    },
    deleteCustomer: (id) => {
        return axiosInstance.delete(`/customers/${id}`);
    },
};

// {{base-url}}/api/customers/pagination?page=1&size=1&sort=firstName,asc

export default customerApi;
