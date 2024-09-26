// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/AdminNav.css'; // Importing CSS for the Navbar

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item">
                    <Link to="/">Home</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/Quotations">Quotations</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/User Management">User Management</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/Notifications">Notifications</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
