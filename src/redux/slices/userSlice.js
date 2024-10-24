import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import userApi from '../../api/userApi';

// Async Thunks

// Set the base URL for axios
const API_URL = 'http://localhost:8080/api/users/all'; // Update the base URL to point to your mock API

// Fetch users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await userApi.getAllusers();
    return response.data;
});

// export const fetchUsersByIds = createAsyncThunk('users/fetchByIds', async (userIds) => {
//     const response = await userApi.getuserById(userIds);
//     return response.data; // Assuming the API returns an array of users
// });

// Fetch unique departments based on users data
export const fetchDepartments = createAsyncThunk('users/fetchDepartments', async () => {
    const response = await axios.get(`${API_URL}`);
    const users = response.data;

    const departments = [...new Set(users.map(user => user.department))].map(department => ({
        id: department,
        name: department,
    }));

    return departments;
});

// Fetch users by department
export const fetchUsersByDepartment = createAsyncThunk('users/fetchUsersByDepartment', async (department) => {
    const response = await axios.get(`${API_URL}?department=${department}`);
    return response.data;
});

// Add a new user
export const addUser = createAsyncThunk('users/addUser', async (newUser) => {
    const response = await userApi.createuser(newUser);
    return response.data;
});

// Update user
export const updateUser = createAsyncThunk('users/updateUser', async ({ userId, userData }) => {
    const response = await userApi.updateuser(userId, userData);
    return response.data;
});

// Delete user
export const deleteUser = createAsyncThunk('users/deleteUser', async (userId) => {
    await userApi.deleteuser(userId);
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
                const index = state.users.findIndex(user => user.userId === updatedUser.userId);
                if (index !== -1) {
                    state.users[index] = updatedUser; // Update the user in the state
                }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                const userId = action.payload;
                state.users = state.users.filter(user => user.userId !== userId);
            })
            // .addCase(fetchUsersByIds.pending, (state) => {
            //     state.loading = true;
            // })
            // .addCase(fetchUsersByIds.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.users = action.payload;
            // })
            // .addCase(fetchUsersByIds.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.error.message;
            // })
            ;
    },
});

// Action exports
export const { clearError } = userSlice.actions;

// Selectors
export const selectUserstatus = (state) => state.users.status;
export const selectUsers = (state) => state.users.users;

// Export the reducer as default
export default userSlice.reducer;
