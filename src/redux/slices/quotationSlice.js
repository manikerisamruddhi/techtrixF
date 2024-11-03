import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import quotationApi from '../../api/quotationApi';

// Async Thunks
export const fetchQuotations = createAsyncThunk('quotations/fetchQuotations', async () => {
    const response = await quotationApi.getAllQuotations();
    return response.data; // Return the fetched data
});

export const addQuotation = createAsyncThunk('quotations/addQuotation', async (newQuotation) => {
    try {
        const response = await quotationApi.createQuotation(newQuotation);
        return response.data; // Return the added quotation
    } catch (error) {
        throw error; // Rethrow the error to be caught by the extraReducers
    }
});

export const getQuotationById = createAsyncThunk('quotations/getQuotationById', async (quotationId) => {
    const response = await quotationApi.getQuotationById(quotationId);
    return response.data; // Return the fetched quotation
});

// export const getQuotationByUserIdAndInitiatedStatus = createAsyncThunk('quotations/getByUserIdAndStatus', async (userId) => {
//     const response = await quotationApi.getQuotationByUserIdAndInitiatedStatus(userId);
//     // console.log(response);
//     return response.data; // Return the fetched quotation
// });

export const getQuotationByUserIdAndInitiatedStatus = createAsyncThunk(
    'quotations/getByUser IdAndStatus',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await quotationApi.getQuotationByUserIdAndInitiatedStatus(userId);
            console.log(response);
            // Check if the response is okay
                // if (!response.ok) {
                //     // Handle non-200 responses
                //     // console.log('error');
                //     const errorMessage = `Error: ${response.status} ${response.statusText}`;
                //     return response.data; // Return the error message //to---------------------be change
                // }

            // Return the data from the response if the request was successful
            // const data = await response.json(); // Assuming the response is in JSON format
            return response.data; // Return the fetched quotation data
        } catch (error) {
            // Handle any network errors or exceptions
            return rejectWithValue(error.message); // Return the error message
        }
    }
);

export const getQuotationByTicketId = createAsyncThunk('quotations/getQuoatationByTicketId', async (ticketId) => {
    const response = await quotationApi.getQuotationByTicketId(ticketId);
    return response.data;
});

// New AsyncThunk for updating quotation status
export const updateQuotation = createAsyncThunk('quotations/updateQuotation', async ({ quotationId, data }) => {
    try {
        console.log(quotationId);
        const response = await quotationApi.updateQuotation(quotationId, data); // Adjust to your API method
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

            // Get Quotation by ID
            .addCase(getQuotationById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getQuotationById.fulfilled, (state, action) => {
                state.loading = false;
                const quotation = action.payload;
                const index = state.quotations.findIndex(q => q.id === quotation.id);
                if (index !== -1) {
                    state.quotations[index] = quotation; // Update existing quotation if found
                } else {
                    state.quotations.push(quotation); // Otherwise, add it to the list
                }
            })
            .addCase(getQuotationById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Get Quotation by User ID and Status
            .addCase(getQuotationByUserIdAndInitiatedStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(getQuotationByUserIdAndInitiatedStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.quotations = Array.isArray(action.payload) ? action.payload : []; // Ensure it's an array
            })
            .addCase(getQuotationByUserIdAndInitiatedStatus.rejected, (state, action) => {
                state.loading = false;
                // state.error = action.error.message;
            })

           .addCase(getQuotationByTicketId.pending, (state) => {
                state.loading = true;
            })
            .addCase(getQuotationByTicketId.fulfilled, (state, action) => {
                state.loading = false;
                state.quotations = action.payload; // Replace existing quotations with fetched ones
            })
            .addCase(getQuotationByTicketId.rejected, (state, action) => {
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

// Export the actions and reducer
export const { resetError } = quotationSlice.actions;
export default quotationSlice.reducer;
