import axiosInstance from './axiosInstance';

const notificationApi = {
    getAllNotifications: () => {
        return axiosInstance.get('/notifications');
    },
    getNotificationById: (id) => {
        return axiosInstance.get(`/notifications/${id}`);
    },
    createNotification: (notificationData) => {
        return axiosInstance.post('/notifications', notificationData);
    },
    markAsRead: (notificationId) => {
        return axios.put(`notifications/${notificationId}/mark-as-read`);
    },
    updateNotification: (id, notificationData) => {
        return axiosInstance.put(`/notifications/${id}`, notificationData);
    },
    deleteNotification: (id) => {
        return axiosInstance.delete(`/notifications/${id}`);
    },
    // Email notifications
    sendEmailNotification: (emailData) => {
        return axiosInstance.post('/notifications/email', emailData);
    },
};

export default notificationApi;
