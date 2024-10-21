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

// New AsyncThunk for updating quotation status
export const updateQuotation = createAsyncThunk('quotations/updateQuotation', async ({ id, data }) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}`, data); // Use PATCH or PUT depending on your API
        return response.data; // Return the updated quotation
    } catch (error) {
        throw error; // Rethrow the error to be caught by the extraReducers
    }
});

// Quotation Slice
const quotationSlice = createSlice({
    name: 'quotations',
    initialState: {
        quotations: [],
        loading: false,
        error: null,
    },
    reducers: {
        resetError: (state) => {
            state.error = null; // Reset error state
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Quotations
            .addCase(fetchQuotations.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchQuotations.fulfilled, (state, action) => {
                state.loading = false;
                state.quotations = action.payload;
            })
            .addCase(fetchQuotations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Add Quotation
            .addCase(addQuotation.pending, (state) => {
                state.loading = true;
            })
            .addCase(addQuotation.fulfilled, (state, action) => {
                state.loading = false;
                state.quotations.push(action.payload);
            })
            .addCase(addQuotation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Update Quotation
            .addCase(updateQuotation.pending, (state) => {
                state.loading = true; // Set loading to true when update is in progress
            })
            .addCase(updateQuotation.fulfilled, (state, action) => {
                state.loading = false;
                const updatedQuotation = action.payload;
                const index = state.quotations.findIndex((q) => q.id === updatedQuotation.id);
                if (index !== -1) {
                    state.quotations[index] = updatedQuotation; // Update the quotation in the state
                }
            })
            .addCase(updateQuotation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Set error message on failure
            });
    },
});

export const { resetError } = quotationSlice.actions;
export default quotationSlice.reducer;
