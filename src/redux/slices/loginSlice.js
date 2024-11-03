import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/authApi';
import store from '../store'; // Assuming your store is in '../store' to dispatch logout

// Time (in milliseconds) to automatically log out after tab is closed
const LOGOUT_TIME_LIMIT = 10 * 60 * 1000; // 10 minutes in milliseconds

// Async Thunks
export const loginUser = createAsyncThunk(
    'users/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);
            const loginUserResponse = response.data;
            
            if (loginUserResponse.httpStatus === "OK") {
                localStorage.setItem('user', JSON.stringify(loginUserResponse.userContent));
                localStorage.setItem('lastActive', Date.now()); // Set initial activity time
                return loginUserResponse.userContent;
            } else {
                return rejectWithValue(loginUserResponse.message);
            }
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to login');
        }
    }
);

export const logoutUser = createAsyncThunk('users/logoutUser', async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('lastActive');
    return {};
});

// Check last activity and log out if 5 minutes have passed
export const checkForAutoLogout = () => {
    const lastActive = localStorage.getItem('lastActive');
    if (lastActive && Date.now() - parseInt(lastActive, 10) > LOGOUT_TIME_LIMIT) {
        store.dispatch(logoutUser());
    }
};

// User Slice
const userSlice = createSlice({
    name: 'users',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        isAuthenticated: !!localStorage.getItem('user'),
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
                state.isAuthenticated = true;
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

// Set last active time on tab close
window.addEventListener('beforeunload', () => {
    localStorage.setItem('lastActive', Date.now());
});

// Check for auto-logout on load
checkForAutoLogout();
