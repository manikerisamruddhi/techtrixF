import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Set the base URL for the API
const API_URL = 'http://localhost:4000/quotations';

// Async Thunks
export const fetchQuotations = createAsyncThunk('quotations/fetchQuotations', async () => {
    const response = await axios.get(API_URL);
    return response.data; // Return the fetched data
});

export const addQuotation = createAsyncThunk('quotations/addQuotation', async (newQuotation) => {
    try {
        const response = await axios.post(API_URL, newQuotation);
        return response.data; // Return the added quotation
    } catch (error) {
        throw error; // Rethrow the error to be caught by the extraReducers
    }
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
            .addCase(addQuotation.pending, (state) => {
                state.loading = true; // Set loading to true
            })
            .addCase(addQuotation.fulfilled, (state, action) => {
                state.loading = false; // Set loading to false
                state.quotations.push(action.payload); // Add new quotation
            })
            .addCase(addQuotation.rejected, (state, action) => {
                state.loading = false; // Set loading to false
                state.error = action.error.message; // Set error message
            });
    },
});

export const { resetError } = quotationSlice.actions;
export default quotationSlice.reducer;
