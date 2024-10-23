import axiosInstance from './axiosInstance';

const ticketApi = {
    getAllTickets: () => {
        return axiosInstance.get('/tickets/all');
    },
    getTicketById: (id) => {
        return axiosInstance.get(`/tickets/get/${id}`);
    },
    createTicket: (ticketData) => {
        return axiosInstance.post('/tickets/add', ticketData);
    },
    updateTicket: (id, ticketData) => {
        return axiosInstance.put(`/tickets/update/${id}`, ticketData);
    },
    deleteTicket: (id) => {
        return axiosInstance.delete(`/tickets/${id}`);
    },
    // / Ticket threads
    addTicketThread: (ticketId, threadData) => {
        return axiosInstance.post(`/tickets/${ticketId}/threads`, threadData);
    },
    getTicketThreads: (ticketId) => {
        return axiosInstance.get(`/tickets/${ticketId}/threads`);
    },
    // / Attachments
    uploadThreadAttachment: (ticketId, threadId, attachmentData) => {
        return axiosInstance.post(`/tickets/${ticketId}/threads/${threadId}/attachments`, attachmentData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

export default ticketApi;
