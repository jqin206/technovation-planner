import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth, db, createUserWithEmailAndPassword, collection, addDoc } from './configuration';
import './Signup.css'

function Signup() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [team, setTeam] = useState('');
    const [division, setDivision] = useState('');
    const [start, setStart] = useState('');
    const [submission, setSubmission] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const docRef = await addDoc(collection(db, "users"), {
                username: username,
                email: email,
                team: team,
                division: division,
                start: start,
                submission: submission
            });
            // Optionally, redirect the user or show a success message
            navigate('/calendar'); 
        } catch (error) {
            // Handle registration errors (e.g., display an error message)
            console.error("Error creating user:", error);
            alert("Registration failed: " + error.message);
        }
    };

    return (
        <div className = 'page'>
            <div className = 'box_signup'>
            <h1> Create Account </h1>
            <form className='form_signup' onSubmit={handleSubmit}>
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
                    Username
                    <input 
                        type="text" 
                        id="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                <label>
                    Team Name
                    <input 
                        type="text" 
                        id="team"
                        placeholder="Team Name"
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Division
                    <div className="radio-group">
                        <div className="radio-item">
                            <input 
                                type="radio" 
                                name="division" 
                                value="beginner" 
                                id="beginner"
                                checked={division === 'beginner'}
                                onChange={(e) => setDivision(e.target.value)}
                            />
                            <label htmlFor="beginner">Beginner (ages 8-12)</label>
                        </div>
                        <div className="radio-item">
                            <input 
                                type="radio" 
                                name="division" 
                                value="junior" 
                                id="junior"
                                checked={division === 'junior'}
                                onChange={(e) => setDivision(e.target.value)} 
                            />
                            <label htmlFor="junior">Junior (ages 13-15)</label>
                        </div>
                        <div className="radio-item">
                            <input 
                                type="radio" 
                                name="division" 
                                value="senior" 
                                id="senior" 
                                checked={division === 'senior'}
                                onChange={(e) => setDivision(e.target.value)}
                            />
                            <label htmlFor="senior">Senior (ages 16-18)</label>
                        </div>
                    </div>
                </label>
                <label>
                    Start Date
                    <input 
                        type="date"
                        id="start"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Submission Deadline
                    <input
                        type="date"
                        id="submission"
                        value={submission}
                        onChange={(e) => setSubmission(e.target.value)}
                        required
                    />
                </label>
                <button 
                    className='button' 
                    type="submit">
                        Create Account
                </button>
            </form>
        </div>
    </div>
        
    )
}

export default Signup;