import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../../api/userApi'; // Import userApi

// Async Thunks

// Fetch user login using userApi
export const loginUser = createAsyncThunk(
    'users/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            // Assuming API call for login user, you might need to adapt based on your actual login endpoint
            const response = await userApi.getAllusers(); // Fetch all users from the API

            const user = response.data.find(
                (user) => user.email === credentials.email && user.passwordHash === credentials.password
            );

            if (user) {
                // Save user info to local storage
                localStorage.setItem('user', JSON.stringify(user));
                return user;
            } else {
                return rejectWithValue('Invalid credentials');
            }
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to login');
        }
    }
);

// Logout user using userApi
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

export default userSlice.reducer;
