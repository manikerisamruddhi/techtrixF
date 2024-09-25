import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InvoiceList from './pages/Invoices/InvoiceList';
import InvoiceDetails from './pages/Invoices/InvoiceDetails';
import CreateInvoice from './pages/Invoices/CreateInvoice';
import EditInvoice from './pages/Invoices/EditInvoice';
import PaymentTracking from './pages/Payments/PaymentTracking'; 
import Dashboard from './pages/dashboard/AdminDashboard';
import Users from './pages/Users/Users';
import Customers from './pages/Customers/Customers';
import Header from './components/Header';
import Login from './pages/auth/LoginPage';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme'; // Custom theme

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    
                    {/* Unprotected Routes */}
                    <Route path="/invoices" element={<InvoiceList />} />
                    <Route path="/invoice/:invoiceId" element={<InvoiceDetails />} />
                    <Route path="/create-invoice" element={<CreateInvoice />} />
                    <Route path="/edit-invoice/:invoiceId" element={<EditInvoice />} />
                    <Route path="/payments" element={<PaymentTracking />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/customers" element={<Customers />} />

                    {/* Default Route */}
                    <Route path="/" element={<Dashboard />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;
