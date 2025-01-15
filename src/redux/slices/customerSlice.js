import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import customerApi from '../../api/customerApi';


// Async Thunks
export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async (_, { rejectWithValue }) => {
    try {
        const response = await customerApi.getAllCustomers(); // Use the base URL
        return response.data; 
    } catch (error) {
        console.error("Error fetching customers:", error);
        return rejectWithValue([]); // Return an empty array on failure
    }
});

export const fetchCustomerByID = createAsyncThunk('customers/fetchCustomerByID', async (id, { rejectWithValue }) => {
    try {
        const response = await customerApi.getCustomerById(id);
        return response.data;
    } catch (error) {
        // console.error("Error fetching customer by ID:", error);
        return rejectWithValue(null);
    }
});


export const addCustomer = createAsyncThunk('customers/addCustomer', async (newCustomer, { rejectWithValue }) => {
    try {
        // console.log(`request`);
        const response = await customerApi.createCustomer(newCustomer); // Use the base URL
        // console.log(response);
        return response.data;
    } catch (error) {
        // Use rejectWithValue to return the error response
        // console.log("Error adding customer:", error.response.data);
        return rejectWithValue(error.response.data);  // Return the error response for rejection
    }
});

export const updateCustomer = createAsyncThunk('customers/updateCustomer', async ({ customerId, updatedCustomer }, { rejectWithValue }) => {
    try {
        const response = await customerApi.updateCustomer(customerId, updatedCustomer);
        return response.data;
    } catch (error) {
        // console.error("Error updating customer:", error);
        return rejectWithValue(error.response ? error.response.data : 'An unexpected error occurred');
    }
});


export const deleteCustomer = createAsyncThunk('customers/deleteCustomer', async (customerId, { rejectWithValue }) => {
    try {
        await customerApi.deleteCustomer(customerId); // Use the base URL
        return customerId;
    } catch (error) {
        // console.error("Error deleting customer:", error);
        return rejectWithValue(null);
    }
});

// Customer Slice
const customerSlice = createSlice({
    name: 'customers',
    initialState: {
        customers: [],
        selectedCustomerProducts: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.customers = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.status = 'failed';
                state.customers = []; // Use an empty array on failure
                state.error = action.error.message;
            })
            .addCase(addCustomer.fulfilled, (state, action) => {
                if (action.payload) {
                    state.customers.push(action.payload);
                }
            })
            .addCase(addCustomer.rejected, (state, action) => {
                // Set the error message in the state when the action is rejected
                state.error = action.payload;  // action.payload contains the error response
                // console.log(state.error);
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                if (action.payload) {
                    const updatedCustomer = action.payload;
                    const index = state.customers.findIndex(customer => customer.customerId === updatedCustomer.customerId);
                    if (index !== -1) {
                        state.customers[index] = updatedCustomer; // Update the customer in the state
                    }
                }
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                if (action.payload) {
                    const customerId = action.payload;
                    state.customers = state.customers.filter(customer => customer.customerId !== customerId);
                }
            })
            .addCase(fetchCustomerByID.pending, (state) => {
                state.status = 'loading'; // Set loading status
            })
            .addCase(fetchCustomerByID.fulfilled, (state, action) => {
                state.status = 'succeeded'; // Set succeeded status
                state.selectedCustomer = action.payload; // Set the selected customer
            })
            .addCase(fetchCustomerByID.rejected, (state, action) => {
                state.status = 'failed'; // Set failed status state.selectedCustomer = null; // Reset selected customer on failure
                state.error = action.error.message; // Capture error message
            });
    },
});

// Export the reducer as default
export default customerSlice.reducer;