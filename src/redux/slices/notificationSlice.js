import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async () => {
    const response = await axios.get('/api/notifications');
    return response.data;
});

export const addNotification = createAsyncThunk('notifications/addNotification', async (newNotification) => {
    const response = await axios.post('/api/notifications', newNotification);
    return response.data;
});

// New Async Thunk: Get All Notifications
export const getAllNotifications = createAsyncThunk('notifications/getAllNotifications', async () => {
    const response = await axios.get('/api/notifications'); // Adjust the endpoint if needed
    return response.data;
});

// New Async Thunk: Mark Notification as Read
export const markAsRead = createAsyncThunk('notifications/markAsRead', async (notificationId) => {
    const response = await axios.patch(`/api/notifications/${notificationId}`, { read: true }); // Adjust the endpoint and data as necessary
    return response.data;
});

// Notification Slice
const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addNotification.fulfilled, (state, action) => {
                state.notifications.push(action.payload);
            })
            .addCase(getAllNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload; // This can replace the existing notifications
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(notification => notification.id === action.payload.id);
                if (index !== -1) {
                    state.notifications[index] = action.payload; // Update the notification to mark it as read
                }
            });
    },
});

// Exporting the reducer as default
export default notificationSlice.reducer;