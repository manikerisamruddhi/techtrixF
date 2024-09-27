import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Set the base URL for the API
const API_URL = 'http://localhost:4000/quotations';

// Async Thunks
export const fetchQuotations = createAsyncThunk('quotations/fetchQuotations', async () => {
    const response = await axios.get(API_URL); // Updated endpoint
    return response.data; // Return the fetched data
});

export const addQuotation = createAsyncThunk('quotations/addQuotation', async (newQuotation) => {
    const response = await axios.post(API_URL, newQuotation); // Updated endpoint
    return response.data; // Return the added quotation
});

// New Async Thunk: Delete Quotation
export const deleteQuotation = createAsyncThunk('quotations/deleteQuotation', async (quotationId) => {
    await axios.delete(`${API_URL}/${quotationId}`); // Updated endpoint
    return quotationId; // Return the ID for the reducer to use
});

// Quotation Slice
const quotationSlice = createSlice({
    name: 'quotations',
    initialState: {
        quotations: [],
        loading: false, // Change to boolean
        error: null,
    },
    reducers: {
        resetError: (state) => {
            state.error = null; // Reset error state
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuotations.pending, (state) => {
                state.loading = true; // Set loading to true
            })
            .addCase(fetchQuotations.fulfilled, (state, action) => {
                state.loading = false; // Set loading to false
                state.quotations = action.payload; // Update quotations
            })
            .addCase(fetchQuotations.rejected, (state, action) => {
                state.loading = false; // Set loading to false
                state.error = action.error.message; // Set error message
            })
            .addCase(addQuotation.fulfilled, (state, action) => {
                state.quotations.push(action.payload); // Add new quotation
            })
            // Handle delete quotation action
            .addCase(deleteQuotation.fulfilled, (state, action) => {
                const quotationId = action.payload;
                state.quotations = state.quotations.filter(quotation => quotation.id !== quotationId); // Remove deleted quotation
            });
    },
});

export default quotationSlice.reducer;
