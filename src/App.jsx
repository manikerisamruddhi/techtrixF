// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Tickets from './pages/Tickets/Tickets';
import Quotations from './pages/Quotations/Quotations';
import Dashboard from './pages/dashboard/AdminDashHome';
import UserManagement from './pages/Users/UserManagement';
import Login from './pages/auth/LoginPage';
import ProfilePage from './pages/Profile/ProfilePage';
// import ForgotPass from './pages/auth/ForgotPasswordPage';
// import Register from './pages/auth/RegisterPage';
import Customers from './pages/Customers/Customers';
import Invoices from './pages/Invoice';
import ProductList from './pages/Products/Products';
import { ThemeProvider } from '@mui/material/styles'; 
import { CssBaseline } from '@mui/material'; 
import theme from './theme'; 
import Layout from './components/Layout'; 
import ProtectedRoute from './components/Auth/ProtectedRoute'; // Import the ProtectedRoute component
import TicketsService from './ServiceTech/Tickets/ServiceTickets';
import AdminUserManagement from './pages/Admin/AdminUserManagement';

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Layout>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        {/* <Route path="/forgot-password" element={<ForgotPass />} />
                        <Route path="/register" element={<Register />} /> */}
                        
                        {/* Protected Routes */}
                        <Route path="/ProfilePage" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Sales', 'Service_Technical']}>
                                <ProfilePage />
                            </ProtectedRoute>
                        } />
                        <Route path="/" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Sales', 'Service_Technical']}>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/Tickets" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Sales', 'Service_Technical']}>
                                <Tickets />
                            </ProtectedRoute>
                        } />
                        <Route path="/TicketsService" element={
                            <ProtectedRoute allowedRoles={['Service_Technical', 'Sales']}>
                                <TicketsService />
                            </ProtectedRoute>
                        } />
                        <Route path="/Quotations" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Sales', 'Service_Technical']}>
                                <Quotations />
                            </ProtectedRoute>
                        } />
                        <Route path="/UserManagement" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Sales', 'Service_Technical']} allowedUserType= {'Admin_User'}>
                                <UserManagement />
                            </ProtectedRoute>
                        } />
                        <Route path="/AdminUserManagement" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Sales', 'Service_Technical']} allowedUserType= {'Admin_User'}>
                                <AdminUserManagement />
                            </ProtectedRoute>
                        } />
                        <Route path="/Customers" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Sales', 'Service_Technical']} allowedUserType= {'Admin_User'}>
                                <Customers />
                            </ProtectedRoute>
                        } />
                        <Route path="/Invoices" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Sales', 'Service_Technical']} allowedUserType= {'Admin_User'}>
                                <Invoices />
                            </ProtectedRoute>
                        } />
                        <Route path="/Products" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Sales', 'Service_Technical']} allowedUserType= {'Admin_User'}>
                                <ProductList />
                            </ProtectedRoute>
                        } />

                        {/* Sales routes */}
                        {/* <Route path="/Sales" element={
                            <ProtectedRoute allowedRoles={['Sales']}>
                                <ProductList />
                            </ProtectedRoute>
                        } /> */}
                    </Routes>
                </Layout>
            </Router>
        </ThemeProvider>
    );
};

export default App;
