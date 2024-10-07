import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, fetchQuotations, fetchInvoices } from '../../redux/slices/adminDash'; // Adjust according to your structure
import useTicketCounts from '../../hooks/useTicketCount'; // Import the custom hook
import '../../styles/Pages/Admin/Dashboard.css';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { tickets, quotations, invoices, loading, error } = useSelector(state => state.dashboard); // Adjust according to your structure

    // Count the tickets using the custom hook
    const { total, inProgress, resolved, closed, open } = useTicketCounts(tickets);

    // Fetch data when component mounts
    useEffect(() => {
        dispatch(fetchTickets());
        dispatch(fetchQuotations());
        dispatch(fetchInvoices());
    }, [dispatch]);

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <h1>Dashboard</h1>
                <div className="dashboard-cards">
                    {/* Parent Card for All Tickets */}
                    <div className="dashboard-card">
                        <h2>All Tickets</h2>
                        <div className="sub-card">
                            <p>Total: {total}</p>
                            <p>Open: {open}</p>
                            <p>In Progress: {inProgress}</p>
                            <p>Resolved: {resolved}</p>
                            <p>Closed: {closed}</p>
                        </div>
                    </div>

                    {/* Parent Card for Quotations */}
                    <div className="dashboard-card">
                        <h2>Quotations</h2>
                        <div className="sub-card">
                            <p>Delivered Quotations: {quotations.delivered}</p>
                            <p>Remaining Quotations: {quotations.remaining}</p>
                        </div>
                    </div>

                    {/* Parent Card for All Invoices */}
                    <div className="dashboard-card">
                        <h2>All Invoices</h2>
                        <div className="sub-card">
                            <p>In Warranty: {invoices.inWarranty}</p>
                            <p>Out of Warranty: {invoices.outOfWarranty}</p>
                        </div>
                    </div>
                </div>

                {loading && <p>Loading data...</p>}
                {error && <p>Error loading data: {error}</p>}
            </div>
        </div>
    );
};

export default Dashboard;
