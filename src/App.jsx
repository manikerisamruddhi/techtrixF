// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Tickets from './pages/Tickets/Tickets';
import CreateTicket from './components/Ticket/CreateTicket';
import TicketDetails from './pages/Tickets/TicketDetails';
import Quotations from './pages/Quotations/Quotations';
import Dashboard from './pages/dashboard/AdminDashHome';
import UserManagement from './pages/dashboard/UserManagement'
import Login from './pages/auth/LoginPage';
import ForgotPass from './pages/auth/ForgotPasswordPage';
import Register from './pages/auth/RegisterPage';
import Customers from './pages/Customers/Customers';
import Invoices from './pages/Invoice';
import SalesTickets from './components/Sales/SalesTickets';
import SalesQuotations from './components/Sales/SalesQuotations';
import SalesHome from './components/Sales/SalesHome'
import ProductList from './pages/Products/Products';
import { ThemeProvider } from '@mui/material/styles'; // You can choose to keep MUI or remove it if you're fully switching to Ant Design
import { CssBaseline } from '@mui/material'; // Same as above
import theme from './theme'; // Custom theme
import Layout from './components/Layout'; // Use the updated layout
import ProtectedRoute from './components/Auth/ProtectedRoute';

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Layout>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPass />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/Tickets" element={<ProtectedRoute allowedRoles={['Admin']}>
                            <Tickets />
                           </ProtectedRoute> } />
                        
                        {/* protected Routes */}
                        {/* Protected Routes */}
                        <Route path="/" element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/CreateTicket" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Sales']}>
                                <CreateTicket />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/Quotations" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Sales']}>
                                <Quotations />
                            </ProtectedRoute>
                        } />

                        <Route path="/UserManagement" element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <UserManagement />
                            </ProtectedRoute>
                        } />

                        <Route path="/Customers" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Sales']}>
                                <Customers />
                            </ProtectedRoute>
                        } />

                        <Route path="/Invoices" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Sales']}>
                                <Invoices />
                            </ProtectedRoute>
                        } />

                        {/* Sales Role Protected Routes */}
                        <Route path="/Sales" element={
                            <ProtectedRoute allowedRoles={['Sales']}>
                                <SalesHome />
                            </ProtectedRoute>
                        } />
                        <Route path="/Sales-Tickets/:userId" element={
                            <ProtectedRoute allowedRoles={['Sales']}>
                                <SalesTickets />
                            </ProtectedRoute>
                        } />
                        <Route path="/Products" element={
                            // <ProtectedRoute allowedRoles={['Sales']}>
                              
                            // </ProtectedRoute>
                              <ProductList />
                        } />


                        <Route path="/Sales-Quotations" element={
                            <ProtectedRoute allowedRoles={['Sales']}>
                                <SalesQuotations />
                            </ProtectedRoute>
                        } />

                        {/* Ticket Details Accessible for all authenticated users */}
                        <Route path="/Tickets/:ticketId" element={
                            <ProtectedRoute>
                                <TicketDetails />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Layout>
            </Router>
        </ThemeProvider>
    );
};

export default App;