import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const fetchQuotations = createAsyncThunk('quotations/fetchQuotations', async () => {
    const response = await axios.get('/api/quotations');
    return response.data;
});

export const addQuotation = createAsyncThunk('quotations/addQuotation', async (newQuotation) => {
    const response = await axios.post('/api/quotations', newQuotation);
    return response.data;
});

// Quotation Slice
const quotationSlice = createSlice({
    name: 'quotations',
    initialState: {
        quotations: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuotations.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchQuotations.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.quotations = action.payload;
            })
            .addCase(fetchQuotations.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addQuotation.fulfilled, (state, action) => {
                state.quotations.push(action.payload);
            });
    },
});

export default quotationSlice.reducer;
