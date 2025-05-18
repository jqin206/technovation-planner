import React from 'react';
import './Account.css';

export default function Account() {
  return (
    <div className="account">
      <h1 className="countdown">My Account</h1>
        <div className="inline1">
            <div className="username">
                <p className="info">Username:</p>
                <p className="field">roomate</p>
            </div>  
            <div className="team"> 
                <p className="info">Team:</p> 
                <p className="field">wolf pack</p>
            </div>
        </div> 
        <div className="inline2">
            <div className="email">  
                <p className="info">Email Address:</p>
                <p className="field">pack@ucla.edu</p>
            </div>
            <div className="division">  
                <p className="info">Division:</p>
                <p className="field">pillow fighting</p>
            </div>
        </div> 
    </div>
  );
}