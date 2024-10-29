import axiosInstance from './axiosInstance';

const quotationApi = {
    getAllQuotations: () => {
        return axiosInstance.get('/quotations/all');
    },
    getQuotationById: (id) => {
        return axiosInstance.get(`/quotations/get/${id}`);
    },
    createQuotation: (quotationData) => {
        return axiosInstance.post('/quotations/add', quotationData);
    },
    updateQuotation: (id, quotationData) => {
        return axiosInstance.put(`/quotations/update/ ${id}`, quotationData);
    },
    deleteQuotation: (id) => {
        return axiosInstance.delete(`/quotations/${id}`);
    },
    // Quotation products
    // getQuotationProducts: (quotationId) => {
    //     return axiosInstance.get(`/quotations/${quotationId}/products`);
    // },
    // addProductToQuotation: (quotationId, productData) => {
    //     return axiosInstance.post(`/quotations/${quotationId}/products`, productData);
    // },
    getQuotationByUserIdAndInitiatedStatus : (userId) =>{
        return axiosInstance.get(`/quotations/get/user/${userId}`);
    },
    getQuotationByTicketId : (ticketId) => {
        return axiosInstance.get(`/quotations/get/ticket/${ticketId}`);
    }
};

export default quotationApi;