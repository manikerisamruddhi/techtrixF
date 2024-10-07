import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Set the base URL for axios
const API_URL = 'http://localhost:4000'; // Update the base URL to point to your mock API

// Create an instance of Axios
const axiosInstance = axios.create({
    baseURL: API_URL,
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

// Fetch users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
});

// Fetch unique departments based on users data
export const fetchDepartments = createAsyncThunk('users/fetchDepartments', async () => {
    const response = await axios.get(`${API_URL}/users`);
    const users = response.data;

    const departments = [...new Set(users.map(user => user.department))].map(department => ({
        id: department,
        name: department,
    }));

    return departments;
});

// Fetch users by department
export const fetchUsersByDepartment = createAsyncThunk('users/fetchUsersByDepartment', async (department) => {
    const response = await axios.get(`${API_URL}/users?department=${department}`);
    return response.data;
});

// Add a new user
export const addUser = createAsyncThunk('users/addUser', async (newUser) => {
    const response = await axios.post(`${API_URL}/users`, newUser);
    return response.data;
});

// Update user
export const updateUser = createAsyncThunk('users/updateUser', async ({ userId, userData }) => {
    const response = await axios.put(`${API_URL}/users/${userId}`, userData);
    return response.data;
});

// Delete user
export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
    await axios.delete(`${API_URL}/users/${userId}`);
    return userId;
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
        users: [],
        departments: [],
        usersByDepartment: [],
        status: 'idle',
        loggedIn: false,
        userData: null,
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
                state.loggedIn = true;
                state.userData = action.payload.user; // Optional: store user data if needed
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
                state.loggedIn = false;
                state.userData = null; // Clear user data if necessary
            })
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
            .addCase(fetchDepartments.pending, (state) => {
                state.status = 'loading'; // Optional: handle loading state for departments
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.departments = action.payload; // Store fetched departments
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.status = 'failed'; // Optional: handle error state for departments
                state.error = action.error.message;
            })
            .addCase(fetchUsersByDepartment.pending, (state) => {
                state.status = 'loading'; // Handle loading state for users by department
            })
            .addCase(fetchUsersByDepartment.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.usersByDepartment = action.payload; // Store fetched users by department
            })
            .addCase(fetchUsersByDepartment.rejected, (state, action) => {
                state.status = 'failed'; // Handle error state for users by department
                state.error = action.error.message;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const updatedUser = action.payload;
                const index = state.users.findIndex(user => user.id === updatedUser.id);
                if (index !== -1) {
                    state.users[index] = updatedUser; // Update the user in the state
                }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                const userId = action.payload;
                state.users = state.users.filter(user => user.id !== userId);
            });
    },
});

// Action exports
export const { clearError } = userSlice.actions;

// Selectors
export const selectUserStatus = (state) => state.users.status;
export const selectUsers = (state) => state.users.users;

// Export the reducer as default
export default userSlice.reducer;
