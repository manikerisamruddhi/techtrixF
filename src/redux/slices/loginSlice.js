import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/authApi'; // Import authApi

// Async Thunks

// Fetch user login using authApi
export const loginUser = createAsyncThunk(
    'users/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            // Assuming API call for login user, you might need to adapt based on your actual login endpoint
            const response = await authApi.login(credentials); // Authenticate user from authApi
            const loginUserResponse = response.data;
            
            if (loginUserResponse.httpStatus === "OK") {
                // Save user info to local storage
                console.log(loginUserResponse.userContent);
                //user = JSON.stringify(loginUserResponse.userContent);
                console.log(loginUserResponse.userContent);
               // Stringify and store the user object in localStorage
               localStorage.setItem('user', JSON.stringify(loginUserResponse.userContent));
               
               console.log(loginUserResponse.user);
                return loginUserResponse.userContent;
            } else {
                return rejectWithValue(loginUserResponse.message);
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
        user: localStorage.getItem('user') || null, // Load user from local storage
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
                state.isAuthenticated = true; // This will be true
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