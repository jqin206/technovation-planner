import React from 'react'

const Signup = () => {
    console.log("Signup rendered");
    return (
        <div>
            <h1> Create Account </h1>
            <form>
                <input type="email" placeholder="Email address" />
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}

export default Signup;