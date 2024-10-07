import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './slices/customerSlice';
import userReducer from './slices/userSlice';
import ticketReducer from './slices/ticketSlice';
import productReducer from './slices/productSlice';
import quotationReducer from './slices/quotationSlice';
import invoiceReducer from './slices/invoiceSlice';
import notificationReducer from './slices/notificationSlice';
import dashboardReducer from './slices/adminDash'; // Import the dashboard slice

export const store = configureStore({
    reducer: {
        customers: customerReducer,
        users: userReducer,
        tickets: ticketReducer,
        products: productReducer,
        quotations: quotationReducer,
        invoices: invoiceReducer,
        notifications: notificationReducer,
        dashboard: dashboardReducer, // Add the dashboard slice here
    },
});
