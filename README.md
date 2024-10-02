# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


please run the json on port 4000
cmd = json-server --watch db.json --port 4000

and for frountend 
cmd = npm run dev

<!-- 


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TicketList from './pages/Tickets/Tickets';
import CreateTicket from './components/Ticket/CreateTicket';
import Quotations from './pages/Quotations/QuotationList';
// import InvoiceList from './pages/Invoices/InvoiceList';
// import InvoiceDetails from './pages/Invoices/InvoiceDetails';
// import CreateInvoice from './pages/Invoices/CreateInvoice';
// import EditInvoice from './pages/Invoices/EditInvoice';
// import PaymentTracking from './pages/Payments/PaymentTracking'; 
import Dashboard from './pages/dashboard/AdminDashboard';
// import Users from './pages/Users/Users';
// import Customers from './pages/Customers/Customers';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/AdminNav';
import Login from './pages/auth/LoginPage';
import ForgotPass from './pages/auth/ForgotPasswordPage'
import Register from './pages/auth/RegisterPage';
import AdminHomeDash from './pages/dashboard/AdminDashHome'
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme'; // Custom theme

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            
            <CssBaseline />
            <Router>
                <Header/>
                 <Navbar/>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPass />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/TicketList" element={<TicketList />} />
               
                    
                    {/* Unprotected Routes */}

                    <Route path="/CreateTicket" element={<CreateTicket />} />
                    <Route path="/Quotations" element={<Quotations />} />
                    


                    {/* <Route path="/invoices" element={<InvoiceList />} />
                    <Route path="/invoice/:invoiceId" element={<InvoiceDetails />} />
                    <Route path="/create-invoice" element={<CreateInvoice />} />
                    <Route path="/edit-invoice/:invoiceId" element={<EditInvoice />} />
                    <Route path="/payments" element={<PaymentTracking />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/customers" element={<Customers />} /> */}

                    {/* Default Route */}
                    <Route path="/" element={<Dashboard />} />
                 

                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;




admin dashboard 

:
import React from 'react';
import { useSelector } from 'react-redux';
import TicketList from '../Tickets/Tickets.jsx';
import QuotationList from '../Quotations/QuotationList.jsx';
import Users from '../Users/Users.jsx';
import Customers from '../Customers/Customers.jsx';
// import NotificationList from '../../pages/Notifications/NotificationList'; present in the component
import NotificationList from '../../components/NotificationList.jsx';

const AdminDashboard = () => {
    const tickets = useSelector((state) => state.tickets.allTickets);
    const quotations = useSelector((state) => state.quotations.allQuotations);
    const users = useSelector((state) => state.users.allUsers);
    const customers = useSelector((state) => state.customers.allCustomers);
    const notifications = useSelector((state) => state.notifications.allNotifications);

    return (
        <div class="wrapper">
       
        <div className="dashboard-container">
            <h1>Admin Dashboard</h1>
          
            <section>
                <h2>User Management</h2>
                <Customers users={customers} />
            </section>
            <section>
            {/* <h2>Notifications</h2> */}
                {/* 
                <NotificationList notifications={notifications} /> */}
            </section>
        </div>
        </div>
    );
};

export default AdminDashboard;











 -->