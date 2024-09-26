import React from 'react';
import { useSelector } from 'react-redux';
import Header from '../../components/Header.jsx';
import Navbar from '../../components/Dashboard/AdminNav.jsx';
import TicketList from '../../pages/Tickets/TicketList';
import QuotationList from '../../pages/Quotations/QuotationList';
import Users from '../Users/Users.jsx';
import Customers from '../Customers/Customers.jsx';
// import NotificationList from '../../pages/Notifications/NotificationList'; present in the component
import NotificationList from '../../components/NotificationList.jsx';
import '../../styles/Auth/AdminDash.css'

const AdminDashboard = () => {
    const tickets = useSelector((state) => state.tickets.allTickets);
    const quotations = useSelector((state) => state.quotations.allQuotations);
    const users = useSelector((state) => state.users.allUsers);
    const customers = useSelector((state) => state.customers.allCustomers);
    const notifications = useSelector((state) => state.notifications.allNotifications);

    return (
        <div class="wrapper">
            <Navbar />
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
