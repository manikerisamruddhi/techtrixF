import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/authApi';
import store from '../store'; // Assuming your store is in '../store' to dispatch logout

// Constants
const INACTIVITY_LOGOUT_LIMIT = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_SESSION_TIME = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

// Async Thunks
export const loginUser = createAsyncThunk(
    'users/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authApi.login(credentials);
            const loginUserResponse = response.data;

            if (loginUserResponse.httpStatus === 'OK') {
                
                const currentTime = Date.now();
                localStorage.setItem('user', JSON.stringify(loginUserResponse.userContent));
                localStorage.setItem('lastActive', currentTime); // Set initial activity time
                localStorage.setItem('sessionExpiry', currentTime + MAX_SESSION_TIME); // Set session expiry time
                // localStorage.setItem('authToken', loginUserResponse.token); // Save the token

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
    localStorage.removeItem('sessionExpiry');
    // localStorage.removeItem('authToken');
    return {};
});

// Check for auto-logout on inactivity or session expiry
export const checkForAutoLogout = () => {
    const lastActive = localStorage.getItem('lastActive');
    const sessionExpiry = localStorage.getItem('sessionExpiry');

    const currentTime = Date.now();
    // If session is expired or inactivity timeout has passed, log the user out
    if (
        sessionExpiry && currentTime > parseInt(sessionExpiry, 10) || // Session expired
        (lastActive && currentTime - parseInt(lastActive, 10) > INACTIVITY_LOGOUT_LIMIT) // Inactivity timeout
    ) {
        store.dispatch(logoutUser());
    }
};

// Automatically log the user out after session expiry
setInterval(checkForAutoLogout, 1000); // Check every second (you can adjust this frequency)

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

// Update last active time on any interaction
window.addEventListener('mousemove', () => localStorage.setItem('lastActive', Date.now()));
window.addEventListener('keydown', () => localStorage.setItem('lastActive', Date.now()));

// Set last active time on tab close
// window.addEventListener('beforeunload', () => {
//     localStorage.setItem('lastActive', Date.now());
// });

// Check for auto-logout on load
checkForAutoLogout();

// Set a timeout to force logout after inactivity limit
setTimeout(() => {
    checkForAutoLogout();
}, INACTIVITY_LOGOUT_LIMIT);
