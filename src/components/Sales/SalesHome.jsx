import React from 'react';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <h1>Dashboard</h1>
                <div className="dashboard-cards">
                    {/* Parent Card for All Tickets */}
                    <div className="dashboard-card">
                        <h2>All Tickets</h2>
                        <div className="sub-card">
                            <p>total: 10</p> {/* Replace with dynamic data */}
                            <p>InProgress: 5</p> {/* Replace with dynamic data */}
                            <p>resolved: 3</p> {/* Replace with dynamic data */}
                            <p>closed: 2</p> {/* Replace with dynamic data */}
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
