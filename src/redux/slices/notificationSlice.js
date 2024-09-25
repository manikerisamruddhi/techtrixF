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
            });
    },
});

export default notificationSlice.reducer;
