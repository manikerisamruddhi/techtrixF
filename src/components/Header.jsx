// src/components/Header.jsx

import React from 'react';
import '../styles/components/Header.css'; // Import CSS for the Header

const Header = () => {
    return (
        <header className="header">
            <div className="header-content">
                <h1>Untitled UI</h1>
                <div className="notification">
                    <span>We've just launched a new feature! Check out the <a href="#new-dashboard">new dashboard</a>.</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
