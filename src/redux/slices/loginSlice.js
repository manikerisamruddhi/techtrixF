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
  
        if (user) {
          return {
            user: user,
            token: 'fake-jwt-token',
            isAuthenticated: true,
          };
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
          state.user = action.payload.user;
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

export default loginSlice.reducer;
