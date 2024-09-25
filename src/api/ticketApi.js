import axiosInstance from './axiosInstance';

const ticketApi = {
    getAllTickets: () => {
        return axiosInstance.get('/tickets');
    },
    getTicketById: (id) => {
        return axiosInstance.get(`/tickets/${id}`);
    },
    createTicket: (ticketData) => {
        return axiosInstance.post('/tickets', ticketData);
    },
    updateTicket: (id, ticketData) => {
        return axiosInstance.put(`/tickets/${id}`, ticketData);
    },
    deleteTicket: (id) => {
        return axiosInstance.delete(`/tickets/${id}`);
    },
    // Ticket threads
    addTicketThread: (ticketId, threadData) => {
        return axiosInstance.post(`/tickets/${ticketId}/threads`, threadData);
    },
    getTicketThreads: (ticketId) => {
        return axiosInstance.get(`/tickets/${ticketId}/threads`);
    },
    // Attachments
    uploadThreadAttachment: (ticketId, threadId, attachmentData) => {
        return axiosInstance.post(`/tickets/${ticketId}/threads/${threadId}/attachments`, attachmentData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

export default ticketApi;
