import React from 'react';
import Navbar from '../../components/Navbar/AdminNav'; // Assuming Navbar component is in the same folder
import '../../styles/Pages/Admin/Dashboard.css'; // Importing CSS for the Dashboard

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="dashboard-content">
                <h1>Dashboard</h1>
                <div className="dashboard-cards">
                    {/* Parent Card for All Tickets */}
                    <div className="dashboard-card">
                        <h2>All Tickets</h2>
                        <div className="sub-card">
                            <p>Completed: 10</p> {/* Replace with dynamic data */}
                            <p>Pending: 5</p> {/* Replace with dynamic data */}
                            <p>Cancelled: 2</p> {/* Replace with dynamic data */}
                        </div>
                    </div>

                    {/* Parent Card for Quotations */}
                    <div className="dashboard-card">
                        <h2>Quotations</h2>
                        <div className="sub-card">
                            <p>Delivered Quotations: 25</p> {/* Replace with dynamic data */}
                            <p>Remaining Quotations: 15</p> {/* Replace with dynamic data */}
                        </div>
                    </div>

                    {/* Parent Card for All Invoices */}
                    <div className="dashboard-card">
                        <h2>All Invoices</h2>
                        <div className="sub-card">
                            <p>In Warranty: 12</p> {/* Replace with dynamic data */}
                            <p>Out of Warranty: 8</p> {/* Replace with dynamic data */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
};

export default Dashboard;
