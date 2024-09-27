import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/AdminNav.css'; // Importing CSS for the Navbar

const Navbar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Function to open the drawer on hover
    const handleMouseEnter = () => {
        setIsDrawerOpen(true);
    };

    // Function to close the drawer when not hovering
    const handleMouseLeave = () => {
        setIsDrawerOpen(false);
    };

    return (
        <>
            <nav className="navbar">
                <ul className="navbar-list">
                    <li className="navbar-item">
                        <Link to="/">Home</Link>
                    </li>
                    
                    <li className="navbar-item"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}>
                        <Link to="/TicketList">Tickets</Link>

                        {isDrawerOpen && (
                            <div className="drawer">
                                <ul className="drawer-list">
                                    <li>
                                        <Link to="Open">Open</Link>
                                    </li>
                                    <li>
                                        <Link to="InProgress">in- progress</Link>
                                    </li>
                                    <li>
                                        <Link to="Resolved">Resolved</Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </li>

                    <li className="navbar-item">
                        <Link to="/Quotations">Quotations</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/Notifications">Invoices</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/Subscribers">Subscribers</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/User Management">User Management</Link>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Navbar;
