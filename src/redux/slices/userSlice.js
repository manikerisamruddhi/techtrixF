import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axios.get('/api/users');
    return response.data;
});

export const addUser = createAsyncThunk('users/addUser', async (newUser) => {
    const response = await axios.post('/api/users', newUser);
    return response.data;
});

// User Slice
const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            });
    },
});

export default userSlice.reducer;
