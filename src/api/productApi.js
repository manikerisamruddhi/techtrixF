import axiosInstance from './axiosInstance';

const productApi = {
    getAllProducts: () => {
        // console.log(axiosInstance.get(`/products/all`));
        return axiosInstance.get(`/products/all`);
    },
    getProductById: (id) => {
        return axiosInstance.get(`/products/get/${id}`);
    },
    createProduct: (productData) => {
        // console.log(productData);
        return axiosInstance.post('/products/add', productData);
    },
    updateProduct: (id, productData) => {
        return axiosInstance.put(`/products/update/${id}`, productData);
    },
    deleteProduct: (id) => {
        return axiosInstance.delete(`/products/delete/${id}`);
    },
    getProductByCustomer: (id) => {
        return axiosInstance.get(`/products/get/customer/${id}`);
    },
    getNonCustomerProducts: () => {
        return axiosInstance.get(`/products/all-non-customer-products`);
    },
    // Warranty tracking
    getWarrantyInfo: (productId) => {
        return axiosInstance.get(`/products/${productId}/warranty`);
    },
    updateWarrantyInfo: (productId, warrantyData) => {
        return axiosInstance.put(`/products/${productId}/warranty`, warrantyData);
    },
};

export default productApi;