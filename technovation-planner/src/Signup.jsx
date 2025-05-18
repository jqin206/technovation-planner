import React from 'react'
import './Signup.css'

const Signup = () => {
    return (
        <div className = 'page'>
            <div className = 'box'>
            <h1> Create Account </h1>
            <form>
                <label> 
                    Email Address
                    <input type="email" placeholder="Email address" />
                </label>
                <label>
                    Username
                    <input type="text" placeholder="Username" />
                </label>
                <label>
                    Password
                    <input type="password" placeholder="Password" />
                </label>
                <label>
                    Team Name
                    <input type="text" placeholder="Team Name" />
                </label>
                <label>
                    Division
                    <div className="radio-group">
                        <div className="radio-item">
                            <input type="radio" name="division" value="beginner" id="beginner" />
                            <label htmlFor="beginner">Beginner (ages 8-12)</label>
                        </div>
                        <div className="radio-item">
                            <input type="radio" name="division" value="junior" id="junior" />
                            <label htmlFor="junior">Junior (ages 13-15)</label>
                        </div>
                        <div className="radio-item">
                            <input type="radio" name="division" value="senior" id="senior" />
                            <label htmlFor="senior">Senior (ages 16-18)</label>
                        </div>
                    </div>
                </label>
                <label>
                    Start Date
                    <input type="date" />
                </label>
                <label>
                    Submission Deadline
                    <input type="date" />
                </label>
                
                <button type="submit">Create Account</button>
            </form>
        </div>
    </div>
        
    )
}

export default Signup;