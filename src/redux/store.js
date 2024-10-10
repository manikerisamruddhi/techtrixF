// store.js
import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './slices/customerSlice';
import userReducer from './slices/userSlice';
import ticketReducer from './slices/ticketSlice';
import productReducer from './slices/productSlice';
import quotationReducer from './slices/quotationSlice';
import invoiceReducer from './slices/invoiceSlice';
import notificationReducer from './slices/notificationSlice';
import dashboardReducer from './slices/adminDash';
import statusReducer from './slices/statusSlice'; // Import the filters slice

export const store = configureStore({
  reducer: {
    customers: customerReducer,
    users: userReducer,
    tickets: ticketReducer,
    products: productReducer,
    quotations: quotationReducer,
    invoices: invoiceReducer,
    notifications: notificationReducer,
    dashboard: dashboardReducer,
    filters: statusReducer, // Add the filters slice here
  },
});