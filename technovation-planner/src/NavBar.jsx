import React from "react";
import { Link, useLocation } from "react-router-dom";
import './NavBar.css';
import logo from './assets/logo.png';

export default function NavBar() {
    const location = useLocation();
    const hideLinksOn = ["/signup", "/login"];
    const hideLinks = hideLinksOn.includes(location.pathname);
    return (
        <nav className="navbar">
            <div className="logo-section">
                
                <a 
                    href="https://technovationchallenge.org/"
                    target="_blank"
                    rel="noopener noreferrer">
                <img src={logo} alt="Logo" className="logo" />
                </a>
            </div>
            {!hideLinks && (
                <ul className="navbar_links">
                    <li className = "cal">
                        <Link to="/Calendar">My Calender</Link>
                    </li>
                    <li className = "prog">
                        <Link to="/Progress">My Progress</Link>
                    </li>
                    <li className = "acc">
                        <Link to="/Account">My Account</Link>
                    </li>
                </ul>
            )}
            
        </nav>
    )
}