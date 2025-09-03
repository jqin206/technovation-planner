import React from "react";
import { Link, useLocation } from "react-router-dom";
import './NavBar.css';
import logo from './assets/logo.png';

export default function NavBar() {
    const location = useLocation();
<<<<<<< HEAD
    const hideLinksOn = ["/","/signup", "/login", "/generateschedule", "/weeklyschedule"];
=======
    const hideLinksOn = ["/","/signup", "/login", "/admin", "/admin/changedeadline", "/admin/curriculumdivisions", "/admin/curriculumdivisions/beginner", "/admin/curriculumdivisions/junior", "/admin/curriculumdivisions/senior"];
>>>>>>> a232a6ca4210cb297cb432dbf9188ad5d168f0e2
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