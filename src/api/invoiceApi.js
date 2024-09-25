import axiosInstance from './axiosInstance';

const invoiceApi = {
    getAllInvoices: () => {
        return axiosInstance.get('/invoices');
    },
    getInvoiceById: (id) => {
        return axiosInstance.get(`/invoices/${id}`);
    },
    createInvoice: (invoiceData) => {
        return axiosInstance.post('/invoices', invoiceData);
    },
    updateInvoice: (id, invoiceData) => {
        return axiosInstance.put(`/invoices/${id}`, invoiceData);
    },
    deleteInvoice: (id) => {
        return axiosInstance.delete(`/invoices/${id}`);
    },
    // Invoice products
    getInvoiceProducts: (invoiceId) => {
        return axiosInstance.get(`/invoices/${invoiceId}/products`);
    },
    addProductToInvoice: (invoiceId, productData) => {
        return axiosInstance.post(`/invoices/${invoiceId}/products`, productData);
    },
    // Payment tracking
    trackPayment: (invoiceId) => {
        return axiosInstance.get(`/invoices/${invoiceId}/payment`);
    },
    updatePaymentStatus: (invoiceId, paymentData) => {
        return axiosInstance.put(`/invoices/${invoiceId}/payment`, paymentData);
    },
};

export default invoiceApi;
