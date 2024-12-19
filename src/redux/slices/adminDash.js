import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
import ticketApi from '../../api/ticketApi';
import quotationApi from '../../api/quotationApi';
import userApi from '../../api/userApi';
import customerApi from '../../api/customerApi';
import productApi from '../../api/productApi';


// Define the base URL of your JSON server
// const BASE_URL = 'http://localhost:4000';

// Async thunk to fetch tickets
export const fetchTickets = createAsyncThunk('dashboard/fetchTickets', async () => {
    const response = await ticketApi.getAllTickets();
    return response.data;
});

// Async thunk to fetch quotations
export const fetchQuotations = createAsyncThunk('dashboard/fetchQuotations', async () => {
    const response = await quotationApi.getAllQuotations();
    return response.data;
});

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await userApi.getAllusers();
    return response.data;
});

export const fetchCustomers = createAsyncThunk('users/fetchCustomers', async () => {
    const response = await customerApi.getAllCustomers();
    return response.data;
});


export const fetchNonCustProducts = createAsyncThunk('users/fetchNonCustProducts', async () => {
    const response = await productApi.getNonCustomerProducts();
    return response.data;
});




// Async thunk to fetch invoices
// export const fetchInvoices = createAsyncThunk('dashboard/fetchInvoices', async () => {
//     const response = await axios.get(`${BASE_URL}/invoices`);
//     return response.data;
// });

// Create the slice
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        tickets: {
            total: 0,
            inProgress: 0,
            resolved: 0,
            closed: 0,
        },
        quotations: {
            delivered: 0,
            remaining: 0,
        },
        invoices: {
            inWarranty: 0,
            outOfWarranty: 0,
        },
        users: {
            totalUser: 0,
            logistics: 0,
            serviceTechnical: 0,
            sales: 0,
        },
        customers: {
            totalCustomers: 0,
            // logistics: 0,
            // serviceTechnical: 0,
            // sales: 0,
        },
        products: {
            totalProducts: 0,
            // logistics: 0,
            // serviceTechnical: 0,
            // sales: 0,
        },
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Handle fetching tickets
        builder
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.tickets = action.payload; // Assuming payload structure matches your state
                state.loading = false;
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // Handle fetching quotations
        builder
            .addCase(fetchQuotations.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchQuotations.fulfilled, (state, action) => {
                state.quotations = action.payload; // Assuming payload structure matches your state
                state.loading = false;
            })
            .addCase(fetchQuotations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
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


            .addCase(fetchCustomers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.customers = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(fetchNonCustProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNonCustProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload;
            })
            .addCase(fetchNonCustProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
        // Handle fetching invoices
        // builder
        //     .addCase(fetchInvoices.pending, (state) => {
        //         state.loading = true;
        //     })
        //     .addCase(fetchInvoices.fulfilled, (state, action) => {
        //         state.invoices = action.payload; // Assuming payload structure matches your state
        //         state.loading = false;
        //     })
        //     .addCase(fetchInvoices.rejected, (state, action) => {
        //         state.loading = false;
        //         state.error = action.error.message;
        //     });
    },
});

// Export the async actions
// export { fetchTickets, fetchQuotations, fetchInvoices };

// Export the reducer
export default dashboardSlice.reducer;