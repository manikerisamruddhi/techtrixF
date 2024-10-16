import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { notification } from 'antd'; // Import notification

// Async Thunks
export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async () => {
    const response = await axios.get('http://localhost:4000/tickets'); // Adjusted endpoint
    return response.data;
});

export const fetchTicketDetails = createAsyncThunk('tickets/fetchTicketDetails', async (ticketId) => {
    try {
        const response = await axios.get(`http://localhost:4000/tickets/${ticketId}`);

        if (response.status !== 200) {
            throw new Error('Ticket not found');
        }

        const ticket = response.data;

        if (!ticket) {
            throw new Error('Ticket not found');
        }

        return ticket;
    } catch (error) {
        console.error(error.message);
        throw error; // Rethrow error to be caught by createAsyncThunk
    }
});

export const createTicket = createAsyncThunk('tickets/addTicket', async (newTicket) => {
    const response = await axios.post('http://localhost:4000/tickets', newTicket);

    return response.data;
});
    // console.log(response);
    
//     return {
//         id: response.data.id,
//         customerId: response.data.customerId,
//         title: response.data.title,
//         createdBy: newTicket.createdBy,
//         status: newTicket.status,
//         Priority: newTicket.Priority,
//         assignedToID: newTicket.assignedToID,
//         Description: newTicket.Description,
//         description: response.data.description,
//         CreatedDate: new Date().toISOString(),
//         isChargeble: response.data.isChargeble,
//     };
// });

// Add the updateTicket async thunk
export const updateTicket = createAsyncThunk('tickets/updateTicket', async ({ id, data }) => {
    // console.log(data);
    const response = await axios.put(`http://localhost:4000/tickets/${id}`, data);
    return response.data;
});

// Ticket Slice
const ticketSlice = createSlice({
    name: 'tickets',
    initialState: {
        tickets: [],
        loading: false,
        error: null,
        ticket: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload;
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.tickets.push(action.payload);
                
                // Show success notification for ticket creation
                // notification.success({
                //     message: 'Ticket Created',
                //     description: 'The ticket was created successfully!',
                // });
            })
            .addCase(fetchTicketDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTicketDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.ticket = action.payload; // Store the ticket data
            })
            .addCase(fetchTicketDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateTicket.fulfilled, (state, action) => {
                const updatedTicket = action.payload;
                const index = state.tickets.findIndex(ticket => ticket.id === updatedTicket.id);
                if (index !== -1) {
                    // Update the ticket in the state
                    state.tickets[index] = updatedTicket;
                    
                    // Show success notification for ticket update
                    // notification.success({
                    //     message: 'Ticket Updated',
                    //     description: 'The ticket was updated successfully!',
                    // });
                }
            });
    },
});

export default ticketSlice.reducer;
