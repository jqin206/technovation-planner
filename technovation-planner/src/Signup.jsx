import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, createUserWithEmailAndPassword, collection, addDoc } from './configuration';
import './Signup.css'
import { setDoc } from 'firebase/firestore';

function Signup() {
    const [dateError, setDateError] = useState('');
    const [accountError, setAccountError] = useState('');
    const [step, setStep] = useState(1);
    const [accountType, setAccountType] = useState('');
    const [teamNumError, setTeamNumError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        team: '',
        division: '',
        start: '',
        submission: '',
        numTeams: '',
    });
    const navigate = useNavigate();


    const handleNext = () => {
        if (accountType) {
            setAccountError('');
            setStep(2);
        } else {
            setAccountError('Please select whether you are a student or mentor.');
            return;
        }
        
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const limitDate = new Date('2025-05-05');
        const enteredDate = new Date(formData.submission);

        if (formData.accountType === 'Mentor' && (formData.numTeams < 1 || formData.numTeams > 5)) {
            setTeamNumError('Mentors must have between 1 and 5 teams.');
            return;
        }
        setTeamNumError('');
        if (enteredDate > limitDate) {
            setDateError('Your team submission date must be before the program submission deadline of May 5th, 2025.');
            return; 
        }
        setDateError('');

        try {
            await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                accountType: accountType,
                username: formData.username,
                email: formData.email,
                ...(accountType === 'Mentor' && { numTeams: formData.numTeams }),
                ...(accountType === 'Student' && {
                    team: formData.team,
                    division: formData.division,
                    start: formData.start,
                    submission: formData.submission,
                }),
                createdAt: new Date()
            });
            // redirect the user to the calendar page after successful signup
            if (accountType === 'Student') {
                navigate('/calendar');
            }
            if (accountType === 'Mentor') {
                navigate('/teams');
            }
        } catch (error) {
            // Handle registration errors (e.g., display an error message)
            console.error("Error creating user:", error);
            alert("Registration failed: " + error.message);
        }
    };

    return (
        <div className = 'page'>
            <div className = 'box_signup'>
            <h1 className ='signup_title'> Create Account </h1>
            <form className='form_signup' onSubmit={handleSubmit}>
                {step === 1 && (
                <label>
                    Are you a student or mentor?
                    <div className="radio-group">
                        <div className="radio-item">
                            <input 
                                type="radio" 
                                name="position" 
                                value="Student" 
                                id="Student"
                                checked={accountType === 'Student'}
                                onChange={(e) => setAccountType(e.target.value)}
                            />
                            <label htmlFor="Student">Student</label>
                        </div>
                        <div className="radio-item">
                            <input 
                                type="radio" 
                                name="position" 
                                value="Mentor" 
                                id="Mentor"
                                checked={accountType === 'Mentor'}
                                onChange={(e) => setAccountType(e.target.value)} 
                            />
                            <label htmlFor="Mentor">Mentor</label>
                        </div>
                        <button
                            className='button'
                            type="button"
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    </div>
                </label>
                )}                
                {step === 2 && (
                    <div> 
                        <label>
                            Email Address
                            <input 
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required 
                            />
                        </label>
                        <label >
                            Username
                            <input 
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label >
                            Password
                            <input 
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                )}  

            {step === 2 && accountType === 'Mentor' && (
                <div>
                    <label>
                        How many teams are you mentoring?
                        <input 
                            type="number"
                            name="numTeams"
                            placeholder="Number of Teams"
                            min="1"
                            max="5"
                            value={formData.numTeams}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>     
        )}
            {step === 2 && accountType === 'Student' && (
                <div>
                    <label>
                        Team Name
                        <input 
                            type="text" 
                            name="team"
                            placeholder="Team Name"
                            value={formData.team}
                            onChange={handleChange}
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
                                    checked={formData.division === 'beginner'}
                                    onChange={handleChange}
                                />
                                <label htmlFor="beginner">Beginner (ages 8-12)</label>
                            </div>
                            <div className="radio-item">
                                <input 
                                    type="radio" 
                                    name="division" 
                                    value="junior" 
                                    id="junior"
                                    checked={formData.division === 'junior'}
                                    onChange={handleChange}
                                />
                                <label htmlFor="junior">Junior (ages 13-15)</label>
                            </div>
                            <div className="radio-item">
                                <input 
                                    type="radio" 
                                    name="division" 
                                    value="senior" 
                                    id="senior" 
                                    checked={formData.division === 'senior'}
                                    onChange={handleChange}
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
                            value={formData.start}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Submission Deadline
                        <input
                            type="date"
                            id="submission"
                            value={formData.submission}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
            )}
                {accountError && <p className='error'>{accountError}</p>}
                {dateError && <p className='error'>{dateError}</p>}
                {teamNumError && <p className='error'>{teamNumError}</p>}
                {step === 2 && (
                    <button 
                        className='button' 
                        type="submit"
                        disabled={step !== 2}>
                            Create Account
                </button> )}
                <Link className="link" to="/login">Already have an account? Log in here!</Link>
            </form>
        </div>
    </div>
        
    )
}

export default Signup;