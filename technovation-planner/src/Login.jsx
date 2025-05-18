import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './configuration'
import { signInWithEmailAndPassword } from "firebase/auth";
import './Login.css'

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/calendar')
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className = 'page'>
            <div className = 'box_login'>
            <h1> Login </h1>
            <form className='form_login' onSubmit={handleSubmit}>
                {error && <p>{error}</p>}
                <label> 
                    Email Address
                    <input 
                        type="email"
                        id="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </label>
                <label>
                    Password
                    <input 
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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