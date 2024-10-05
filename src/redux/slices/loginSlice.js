import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

// Create an instance of Axios
const axiosInstance = axios.create();
const mock = new AxiosMockAdapter(axiosInstance);

// Mocking the login API
mock.onPost('http://localhost:4000/auth/login').reply((config) => {
    const { email, password } = JSON.parse(config.data);
    
    // Simulate successful login
    if (email === 'user1@example.com' && password === 'password1') {
        return [200, { role: 'user', token: 'fake-jwt-token' }];
    } else if (email === 'admin@example.com' && password === 'adminpass') {
        return [200, { role: 'admin', token: 'fake-jwt-token' }];
    }
    
    // Simulate failed login
    return [401, { message: 'Invalid credentials' }];
});

// Async Thunks
export const loginUser = createAsyncThunk(
    'users/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('http://localhost:4000/auth/login', credentials);
            return {
                role: response.data.role,
                token: response.data.token,
                isAuthenticated: true,
            };
        } catch (error) {
            return rejectWithValue(error.response.data.message || 'Failed to login');
        }
    }
);

export const logoutUser = createAsyncThunk('users/logoutUser', async () => {
    return {}; // Simulate logout logic
});

// User Slice
const userSlice = createSlice({
    name: 'users',
    initialState: {
        user: null,
        token: null,
        isAuthenticated: false,
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
                state.user = { role: action.payload.role };
                state.token = action.payload.token;
                state.isAuthenticated = action.payload.isAuthenticated;
                state.loading = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            });
    },
});

export const { clearError } = userSlice.actions;

export default userSlice.reducer;
