// src/components/Header.jsx

import React from 'react';
import '../../styles/components/Header.css'; // Import CSS for the Header

const Header = () => {
    return (
        <header className="header">
            <div className="header-content">
                <h1>Techtrix</h1>
                <div className="notification">
                    <span> <a href="#new-dashboard">dashboard</a>.</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
