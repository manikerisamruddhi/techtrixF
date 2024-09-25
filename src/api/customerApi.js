import axiosInstance from './axiosInstance';

const customerApi = {
    getAllCustomers: () => {
        return axiosInstance.get('/customers');
    },
    getCustomerById: (id) => {
        return axiosInstance.get(`/customers/${id}`);
    },
    createCustomer: (customerData) => {
        return axiosInstance.post('/customers', customerData);
    },
    updateCustomer: (id, customerData) => {
        return axiosInstance.put(`/customers/${id}`, customerData);
    },
    deleteCustomer: (id) => {
        return axiosInstance.delete(`/customers/${id}`);
    },
};

export default customerApi;
