import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import InvoiceList from './pages/Invoices/InvoiceList';
import InvoiceDetails from './pages/Invoices/InvoiceDetails';
import CreateInvoice from './pages/Invoices/CreateInvoice';
import EditInvoice from './pages/Invoices/EditInvoice';
import PaymentTracking from './pages/Payments/PaymentTracking';
import Dashboard from './pages/Dashboard/Dashboard';
import Users from './pages/Users/Users';
import Customers from './pages/Customers/Customers';
import Header from './components/Header';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute'; // Protect routes based on roles
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme'; // Custom theme

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Switch>
                    {/* Public Routes */}
                    <Route path="/login" component={Login} />
                    
                    {/* Protected Routes */}
                    <ProtectedRoute path="/invoices" component={InvoiceList} />
                    <ProtectedRoute path="/invoice/:invoiceId" component={InvoiceDetails} />
                    <ProtectedRoute path="/create-invoice" component={CreateInvoice} />
                    <ProtectedRoute path="/edit-invoice/:invoiceId" component={EditInvoice} />
                    <ProtectedRoute path="/payments" component={PaymentTracking} />
                    <ProtectedRoute path="/dashboard" component={Dashboard} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/customers" element={<Customers />} />

                    {/* Default Route */}
                    <Route path="/" component={Dashboard} />
                </Switch>
            </Router>
        </ThemeProvider>
    );
};

export default App;
