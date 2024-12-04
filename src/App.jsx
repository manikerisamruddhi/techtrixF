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
                            <ProtectedRoute allowedRoles={['Admin', 'Sales', 'ServiceTech']}>
                                <ProfilePage />
                            </ProtectedRoute>
                        } />
                        <Route path="/" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Sales', 'ServiceTech']}>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/Tickets" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Sales', 'ServiceTech']}>
                                <Tickets />
                            </ProtectedRoute>
                        } />
                        <Route path="/Quotations" element={
                            <ProtectedRoute allowedRoles={['Admin', 'Sales', 'ServiceTech']}>
                                <Quotations />
                            </ProtectedRoute>
                        } />
                        <Route path="/UserManagement" element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <UserManagement />
                            </ProtectedRoute>
                        } />
                        <Route path="/Customers" element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <Customers />
                            </ProtectedRoute>
                        } />
                        <Route path="/Invoices" element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <Invoices />
                            </ProtectedRoute>
                        } />
                        <Route path="/Products" element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <ProductList />
                            </ProtectedRoute>
                        } />

                        {/* Sales routes */}
                        <Route path="/Sales" element={
                            <ProtectedRoute allowedRoles={['Sales']}>
                                <ProductList />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Layout>
            </Router>
        </ThemeProvider>
    );
};

export default App;
