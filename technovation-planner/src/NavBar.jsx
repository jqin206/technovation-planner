import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from './configuration';
import { Link, useLocation } from "react-router-dom";
import './NavBar.css';
import logo from './assets/logo.png';

export default function NavBar() {
    const location = useLocation();
    const hideLinksOn = ["/","/signup", "/login", "/admin", "/generateschedule", "/weeklyschedule", "/admin/changedeadline", "/admin/curriculumdivisions", "/admin/curriculumdivisions/beginner", "/admin/curriculumdivisions/junior", "/admin/curriculumdivisions/senior"];
    const [accountType, setAccountType] = React.useState('');

    useEffect(() => {
          const fetchData = async () => {
            const user = auth.currentUser;
            if (!user) return;
      
            const q = query(collection(db, 'users'), where('email', '==', user.email));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const data = querySnapshot.docs[0].data();
              setAccountType(data.accountType);
            }
          };
      
          fetchData();
        }, []);
        const hideLinks = hideLinksOn.includes(location.pathname) || accountType !== 'Mentor';
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
            {accountType === 'Mentor' && (
                <ul className="navbar_links">
                    <li>
                        <Link to="/Teams">MY TEAMS</Link>
                    </li>
                    <li>
                        <Link to="/MentorAccount">MY ACCOUNT</Link>
                    </li>
                </ul>
            )}
            {"/generateschedule" === location.pathname || "/" === location.pathname && (
                <ul className="navbar_links">
                    <li>
                        <Link to="/login" className="login-button">LOG IN</Link>
                    </li>
                    <li>
                        <Link to="/signup" className="signup-button">CREATE ACCOUNT</Link>
                    </li>
                </ul>

            )}

        </nav>
    )
}