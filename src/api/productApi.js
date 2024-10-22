import axiosInstance from './axiosInstance';

const productApi = {
    getAllProducts: () => {
        return axiosInstance.get('/products/all');
    },
    getProductById: (id) => {
        return axiosInstance.get(`/products/get/${id}`);
    },
    createProduct: (productData) => {
        return axiosInstance.post('/products/add', productData);
    },
    updateProduct: (id, productData) => {
        return axiosInstance.put(`/products/${id}`, productData);
    },
    deleteProduct: (id) => {
        return axiosInstance.delete(`/products/${id}`);
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
