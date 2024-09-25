import React from 'react';
import { useSelector } from 'react-redux';
import TicketList from '../../components/Tickets/TicketList';
import WarrantyList from '../../components/Warranties/WarrantyList';

const TechnicalDashboard = () => {
    const serviceTickets = useSelector((state) => state.tickets.serviceTickets);
    const warranties = useSelector((state) => state.warranties.activeWarranties);

    return (
        <div className="dashboard-container">
            <h1>Technical Dashboard</h1>
            <section>
                <h2>Service Tickets</h2>
                <TicketList tickets={serviceTickets} />
            </section>
            <section>
                <h2>Product Warranties</h2>
                <WarrantyList warranties={warranties} />
            </section>
        </div>
    );
};

export default TechnicalDashboard;
