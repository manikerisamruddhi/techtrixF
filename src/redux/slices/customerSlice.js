import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000/customers';
const PRODUCT_URL = 'http://localhost:4000/products';

// Async Thunks
export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(BASE_URL); // Use the base URL
        return response.data; // Assuming the mock API returns an array of customers
    } catch (error) {
        console.error("Error fetching customers:", error);
        return rejectWithValue([]); // Return an empty array on failure
    }
});

// Fetch Products for Selected Customer
export const fetchProductsBycustomerID = createAsyncThunk('customers/fetchProductsBycustomerID', async (customerID, { rejectWithValue }) => {
    try {
        //console.log(`${BASE_URL}/${customerID}`)
        const customerResponse = await axios.get(`${BASE_URL}/${customerID}`);
        const productIds = customerResponse.data.products || []; // Default to an empty array if products is undefined

        if (productIds.length > 0) {
            const productsResponse = await axios.get(PRODUCT_URL);
            // Filter products based on the IDs from the customer
            return productsResponse.data.filter(product => productIds.includes(product.id));
        } else {
            return []; // Return empty if no products
        }
    } catch (error) {
        console.error("Error fetching products for customer:", error);
        return rejectWithValue([]); // Return empty array on error
    }
});


export const addCustomer = createAsyncThunk('customers/addCustomer', async (newCustomer, { rejectWithValue }) => {
    try {
        const response = await axios.post(BASE_URL, newCustomer); // Use the base URL
        return response.data;
    } catch (error) {
        console.error("Error adding customer:", error);
        return rejectWithValue(null);
    }
});

export const updateCustomer = createAsyncThunk('customers/updateCustomer', async ({ customerID, updatedCustomer }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${BASE_URL}/${customerID}`, updatedCustomer); // Use the base URL
        return response.data;
    } catch (error) {
        console.error("Error updating customer:", error);
        return rejectWithValue(null);
    }
});

export const deleteCustomer = createAsyncThunk('customers/deleteCustomer', async (customerID, { rejectWithValue }) => {
    try {
        await axios.delete(`${BASE_URL}/${customerID}`); // Use the base URL
        return customerID;
    } catch (error) {
        console.error("Error deleting customer:", error);
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
            .addCase(updateCustomer.fulfilled, (state, action) => {
                if (action.payload) {
                    const updatedCustomer = action.payload;
                    const index = state.customers.findIndex(customer => customer.customerID === updatedCustomer.customerID);
                    if (index !== -1) {
                        state.customers[index] = updatedCustomer; // Update the customer in the state
                    }
                }
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                if (action.payload) {
                    const customerID = action.payload;
                    state.customers = state.customers.filter(customer => customer.customerID !== customerID);
                }
            })
            .addCase(fetchProductsBycustomerID.fulfilled, (state, action) => {
                state.selectedCustomerProducts = action.payload; // Set products of the selected customer
            });
    },
});

// Export the reducer as default
export default customerSlice.reducer;
