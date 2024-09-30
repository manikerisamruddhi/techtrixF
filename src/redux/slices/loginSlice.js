import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async Thunks
export const loginUser = createAsyncThunk('users/loginUser', async (role) => {
    // Instead of calling an API, just return the role as user data
    return {
        role, 
        isAuthenticated: true,  // Mark the user as authenticated
    };
});

export const logoutUser = createAsyncThunk('users/logoutUser', async () => {
    return {}; // Clear user data
});

// User Slice
const userSlice = createSlice({
    name: 'users',
    initialState: {
        user: null,
        token: null,
        isAuthenticated: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = { role: action.payload.role };
                state.isAuthenticated = action.payload.isAuthenticated;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            });
    },
});

export default userSlice.reducer;
