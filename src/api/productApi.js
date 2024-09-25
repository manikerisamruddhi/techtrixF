import axiosInstance from './axiosInstance';

const productApi = {
    getAllProducts: () => {
        return axiosInstance.get('/products');
    },
    getProductById: (id) => {
        return axiosInstance.get(`/products/${id}`);
    },
    createProduct: (productData) => {
        return axiosInstance.post('/products', productData);
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
