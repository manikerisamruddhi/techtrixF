import React from 'react';
import { useSelector } from 'react-redux';
import TicketList from '../../pages/Tickets/TicketList';
import QuotationList from '../../pages/Quotations/QuotationList';
import Users from '../Users/Users.jsx';
import Customers from '../Customers/Customers.jsx';
import NotificationList from '../../pages/Notifications/NotificationList';

const AdminDashboard = () => {
    const tickets = useSelector((state) => state.tickets.allTickets);
    const quotations = useSelector((state) => state.quotations.allQuotations);
    const users = useSelector((state) => state.users.allUsers);
    const customers = useSelector((state) => state.customers.allCustomers);
    const notifications = useSelector((state) => state.notifications.allNotifications);

    return (
        <div className="dashboard-container">
            <h1>Admin Dashboard</h1>
            <section>
                <h2>Tickets</h2>
                <TicketList tickets={tickets} />
            </section>
            <section>
                <h2>Quotations</h2>
                <QuotationList quotations={quotations} />
            </section>
            <section>
                <h2>User Management</h2>
                <Users users={users} />
            </section>
            <section>
                <h2>Customer Management</h2>
                <Customers users={customers} />
            </section>
            <section>
                <h2>Notifications</h2>
                <NotificationList notifications={notifications} />
            </section>
        </div>
    );
};

export default AdminDashboard;
