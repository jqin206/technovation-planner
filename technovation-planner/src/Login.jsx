import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './Login.css'

function Login() {
    return (
        <div className = 'page'>
            <div className = 'box_login'>
            <h1> Login </h1>
            <form className='form_login'>
                <label> 
                    Email Address
                    <input 
                        type="email"
                        id="email"
                        placeholder="Email Address"
                        required 
                    />
                </label>
                <label>
                    Password
                    <input 
                        type="password"
                        id="password"
                        placeholder="Password"
                        required
                    />
                </label>
                <button 
                    className='button' 
                    type="submit">
                        Login
                </button>
                <Link className="link" to="/signup">No account? Create one!</Link>
            </form>
        </div>
    </div>
        
    )
}

export default Login;