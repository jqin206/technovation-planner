import React from "react";
import { Link, useLocation } from "react-router-dom";
import './NavBar.css';
import logo from './assets/logo.png';

export default function NavBar() {
    const location = useLocation();
    const hideLinksOn = ["/","/signup", "/login", "/generateschedule", "/weeklyschedule"];
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
                    <li>
                        <Link to="/Calendar">MY CALENDAR</Link>
                    </li>
                    <li>
                        <Link to="/Schedule">MY SCHEDULE</Link>
                    </li>
                    <li>
                        <Link to="/Progress">MY PROGRESS</Link>
                    </li>
                    <li>
                        <Link to="/Account">MY ACCOUNT</Link>
                    </li>
                </ul>
            )}
            
        </nav>
    )
}