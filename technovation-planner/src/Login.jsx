import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth, doc, db, getDoc } from './configuration'
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
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                setError("User data not found.");
                return;
            }

            const userData = userDocSnap.data();
            const accountType = userData.accountType;

                if (accountType === 'Student')
                    navigate('/calendar'); 
                else if (accountType === 'Mentor')
                    navigate('/teams')

        } catch (error) {
            console.log("Error: ", error);
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/invalid-email':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    setError('Incorrect email or password.');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many login attempts. Please try again later.');
                    break;
                default:
                    setError('An unexpected error occurred. Please try again.');
                    break;
            }
        }
    };

    return (
        <div className = 'page'>
            <div className = 'box_login'>
            <h1 className='login'> Login </h1>
            <form className='form_login' onSubmit={handleSubmit}>
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
                {error && <p className='error'>{error}</p>}
            </form>
        </div>
    </div>
        
    )
}

export default Login;