import axiosInstance from './axiosInstance';

const quotationApi = {
    getAllQuotations: () => {
        return axiosInstance.get('/quotations');
    },
    getQuotationById: (id) => {
        return axiosInstance.get(`/quotations/${id}`);
    },
    createQuotation: (quotationData) => {
        return axiosInstance.post('/quotations', quotationData);
    },
    updateQuotation: (id, quotationData) => {
        return axiosInstance.put(`/quotations/${id}`, quotationData);
    },
    deleteQuotation: (id) => {
        return axiosInstance.delete(`/quotations/${id}`);
    },
    // Quotation products
    getQuotationProducts: (quotationId) => {
        return axiosInstance.get(`/quotations/${quotationId}/products`);
    },
    addProductToQuotation: (quotationId, productData) => {
        return axiosInstance.post(`/quotations/${quotationId}/products`, productData);
    },
};

export default quotationApi;
