// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TicketList from './pages/Tickets/Tickets';
import CreateTicket from './components/Ticket/CreateTicket';
import Quotations from './pages/Quotations/QuotationList';
import Dashboard from './pages/dashboard/AdminDashHome';
import Login from './pages/auth/LoginPage';
import ForgotPass from './pages/auth/ForgotPasswordPage';
import Register from './pages/auth/RegisterPage';
import { ThemeProvider } from '@mui/material/styles'; // You can choose to keep MUI or remove it if you're fully switching to Ant Design
import { CssBaseline } from '@mui/material'; // Same as above
import theme from './theme'; // Custom theme
import Layout from './components/Layout'; // Use the updated layout

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
                        <Route path="/TicketList" element={<TicketList />} />
                        
                        {/* Unprotected Routes */}
                        <Route path="/CreateTicket" element={<CreateTicket />} />
                        <Route path="/Quotations" element={<Quotations />} />

                        {/* Default Route */}
                        <Route path="/" element={<Dashboard />} />
                    </Routes>
                </Layout>
            </Router>
        </ThemeProvider>
    );
};

export default App;
