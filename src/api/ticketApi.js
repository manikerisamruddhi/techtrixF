import axiosInstance from './axiosInstance';

const ticketApi = {
    getAllTickets: () => {
        return axiosInstance.get('/api/tickets/all');
    },
    getTicketById: (id) => {
        return axiosInstance.get(`/api/tickets/get/${id}`);
    },
    createTicket: (ticketData) => {
        return axiosInstance.post('/api/tickets/add', ticketData);
    },
    updateTicket: (id, ticketData) => {
        return axiosInstance.put(`/api/tickets/update/${id}`, ticketData);
    },
    deleteTicket: (id) => {
        return axiosInstance.delete(`/api/tickets/${id}`);
    },
    // Ticket threads
    addTicketThread: (ticketId, threadData) => {
        return axiosInstance.post(`/api/tickets/${ticketId}/threads`, threadData);
    },
    getTicketThreads: (ticketId) => {
        return axiosInstance.get(`/api/tickets/${ticketId}/threads`);
    },
    // Attachments
    uploadThreadAttachment: (ticketId, threadId, attachmentData) => {
        return axiosInstance.post(`/api/tickets/${ticketId}/threads/${threadId}/attachments`, attachmentData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

export default ticketApi;
