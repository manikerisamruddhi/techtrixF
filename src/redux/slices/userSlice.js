import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Set the base URL for axios
const API_URL = 'http://localhost:4000'; // Update the base URL to point to your mock API

// Async Thunks
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axios.get(`${API_URL}/users`); // Update endpoint to use API_URL
    return response.data;
});

// Updated fetchDepartments to return unique departments based on the users data
export const fetchDepartments = createAsyncThunk('users/fetchDepartments', async () => {
    const response = await axios.get(`${API_URL}/users`);
    const users = response.data;

    // Extract unique departments from users
    const departments = [...new Set(users.map(user => user.department))].map(department => ({
        id: department, // Using department name as id
        name: department // Assuming department name is unique
    }));

    return departments;
});


// New Async Thunk: Fetch Users by Department
export const fetchUsersByDepartment = createAsyncThunk('users/fetchUsersByDepartment', async (department) => {
    const response = await axios.get(`${API_URL}/users?department=${department}`); // Adjust endpoint to filter by department
    return response.data;
});

export const addUser = createAsyncThunk('users/addUser', async (newUser) => {
    const response = await axios.post(`${API_URL}/users`, newUser); // Update endpoint to use API_URL
    return response.data;
});

// New Async Thunk: Update User
export const updateUser = createAsyncThunk('users/updateUser', async ({ userId, userData }) => {
    const response = await axios.put(`${API_URL}/users/${userId}`, userData); // Update endpoint to use API_URL
    return response.data; // Return the updated user data
});

// New Async Thunk: Delete User
export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
    await axios.delete(`${API_URL}/users/${userId}`); // Update endpoint to use API_URL
    return userId; // Return the ID for the reducer to use
});

// New Async Thunk: Login User
export const loginUser = createAsyncThunk('users/loginUser', async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials); // Update endpoint to use API_URL
    return response.data; // Assuming the response contains user data or a token
});

// New Async Thunk: Logout User
export const logoutUser = createAsyncThunk('users/logoutUser', async () => {
    await axios.post(`${API_URL}/logout`); // Update the endpoint to use API_URL
    return; // Nothing to return
});

// User Slice
const userSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        departments: [],  // New state for departments
        usersByDepartment: [], // New state for users by department
        status: 'idle',
        error: null,
        loggedIn: false, // Add a field to track login status
        userData: null,  // Optional: store user data if needed
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
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                // Handle the successful login
                state.loggedIn = true; // Set login status to true
                state.userData = action.payload; // Optionally save user data
            })
            .addCase(logoutUser.fulfilled, (state) => {
                // Handle the logout
                state.loggedIn = false; // Set login status to false
                state.userData = null; // Clear user data if necessary
            });
    },
});

// Export the reducer as default
export default userSlice.reducer;
