import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create an instance of Axios
const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000', // Assuming the JSON server is running on port 4000
    headers: {
        'Content-Type': 'application/json',
    },
});

// Async Thunks

// Fetch user login from db.json mock API
export const loginUser = createAsyncThunk(
    'users/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/users', {
                params: { email: credentials.email, password: credentials.password },
            });

            const user = response.data[0]; // Assuming a match returns an array of users

            console.log(user);
            if (user && user.isAuthenticated) {
                // Save user info to local storage
                const s = localStorage.setItem('user', JSON.stringify(user));
                console.log(s)
                return user;
            } else {
                return rejectWithValue('Invalid credentials');
            }
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to login');
        }
    }
);

// Logout user
export const logoutUser = createAsyncThunk('users/logoutUser', async () => {
    // Clear user from local storage
    localStorage.removeItem('user');
    return {}; // Return an empty object
});

// User Slice
const userSlice = createSlice({
    name: 'users',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null, // Load user from local storage
        isAuthenticated: !!localStorage.getItem('user'), // Check if user is authenticated based on local storage
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = action.payload.isAuthenticated; // This will be true
                state.loading = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export const { clearError } = userSlice.actions;

export default userSlice.reducer; // Fix the export to use userSlice
