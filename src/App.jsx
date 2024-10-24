// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Tickets from './pages/Tickets/Tickets';
import TicketDetails from './pages/Tickets/TicketDetails';
import Quotations from './pages/Quotations/Quotations';
import Dashboard from './pages/dashboard/AdminDashHome';
import UserManagement from './pages/dashboard/UserManagement';
import Login from './pages/auth/LoginPage';
import ForgotPass from './pages/auth/ForgotPasswordPage';
import Register from './pages/auth/RegisterPage';
import Customers from './pages/Customers/Customers';
import Invoices from './pages/Invoice';
import SalesTickets from './components/Sales/SalesTickets';
import SalesQuotations from './components/Sales/SalesQuotations';
import SalesHome from './components/Sales/SalesHome';
import ProductList from './pages/Products/Products';
import { ThemeProvider } from '@mui/material/styles'; 
import { CssBaseline } from '@mui/material'; 
import theme from './theme'; 
import Layout from './components/Layout'; 
import ProtectedRoute from './components/Auth/ProtectedRoute'; // Import the ProtectedRoute component

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
                        
                        {/* Protected Routes */}
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/Tickets" element={
                            <ProtectedRoute>
                                <Tickets />
                            </ProtectedRoute>
                        } />
                        <Route path="/Quotations" element={
                            <ProtectedRoute>
                                <Quotations />
                            </ProtectedRoute>
                        } />
                        <Route path="/UserManagement" element={
                            <ProtectedRoute>
                                <UserManagement />
                            </ProtectedRoute>
                        } />
                        <Route path="/Customers" element={
                            <ProtectedRoute>
                                <Customers />
                            </ProtectedRoute>
                        } />
                        <Route path="/Invoices" element={
                            <ProtectedRoute>
                                <Invoices />
                            </ProtectedRoute>
                        } />
                        <Route path="/Sales" element={
                            <ProtectedRoute>
                                <SalesHome />
                            </ProtectedRoute>
                        } />
                        <Route path="/Sales-Tickets/:userId" element={
                            <ProtectedRoute>
                                <SalesTickets />
                            </ProtectedRoute>
                        } />
                        <Route path="/Products" element={
                            <ProtectedRoute>
                                <ProductList />
                            </ProtectedRoute>
                        } />
                        <Route path="/Sales-Quotations" element={
                            <ProtectedRoute>
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
