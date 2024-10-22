import axiosInstance from './axiosInstance';

const quotationApi = {
    getAllQuotations: () => {
        return axiosInstance.get('/api/quotations');
    },
    getQuotationById: (id) => {
        return axiosInstance.get(`/api/quotations/${id}`);
    },
    createQuotation: (quotationData) => {
        return axiosInstance.post('/api/quotations', quotationData);
    },
    updateQuotation: (id, quotationData) => {
        return axiosInstance.put(`/api/quotations/${id}`, quotationData);
    },
    deleteQuotation: (id) => {
        return axiosInstance.delete(`/api/quotations/${id}`);
    },
    // Quotation products
    getQuotationProducts: (quotationId) => {
        return axiosInstance.get(`/api/quotations/${quotationId}/products`);
    },
    addProductToQuotation: (quotationId, productData) => {
        return axiosInstance.post(`/api/quotations/${quotationId}/products`, productData);
    },
};

export default quotationApi;
