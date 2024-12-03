import axiosInstance from './axiosInstance';

const productApi = {
    getAllProducts: () => {
        // console.log(axiosInstance.get(`/products/all`));
        return axiosInstance.get(`/products/all`);
    },
    getProductById: (id) => {
        return axiosInstance.get(`/products/get/${id}`);
    },
    getAllProductsHardware: () => {
        return axiosInstance.get(`/products/all-hardwares`);
    },
    getAllProductsService: () => {
        return axiosInstance.get(`/products/all-services`);
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
    updateQuotationProduct: (quotationId, productId, Data) => {
        return axiosInstance.put(`/quotation-products/update/quotation/${quotationId}/product/${productId}`, Data);
    },
    deleteQuotationProduct: (quotationProductId) => {
        return axiosInstance.delete(`/quotation-products/delete/${quotationProductId}`);
    }
};

export default productApi;