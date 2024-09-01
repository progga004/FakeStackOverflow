import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = "http://localhost:8000"; // Update with your server URL

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');

    const navigate = useNavigate(); // Hook for navigation

    const handleUsername = (event) => {
        setUsername(event.target.value);
    }

    const handleEmail = (event) => {
        setEmail(event.target.value);
        // Validate email format
        if (!/\S+@\S+\.\S+/.test(event.target.value)) {
            setEmailError('Invalid email format');
        } else {
            setEmailError('');
        }
    }

    const handlePassword = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        // Validate password length
        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
        } else {
            setPasswordError('');
        }
        // Check if passwords match when the password input changes
        setPasswordsMatch(newPassword === verifyPassword);

        // Check if the typed password contains the username or email
        if (newPassword.includes(username) || newPassword.includes(email)) {
            setPasswordError('Password should not contain the username or email');
        }
    }

    const handleVerifyPassword = (event) => {
        const newVerifyPassword = event.target.value;
        setVerifyPassword(newVerifyPassword);
        // Check if passwords match when the verify password input changes
        setPasswordsMatch(password === newVerifyPassword);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Set the submitted state to true
        setSubmitted(true);

        // Display error if email format is invalid
        if (emailError) {
            return;
        }

        // Display error if password length is invalid
        if (passwordError) {
            return;
        }

        // Verify the passwords are the same
        if (!passwordsMatch) {
            return;
        }

        // Validate that username, email, and password are not blank
        if (!username.trim()) {
            setUsernameError('Username cannot be blank');
            return;
        } else {
            setUsernameError('');
        }

        if (!email.trim()) {
            setEmailError('Email cannot be blank');
            return;
        }

        if (!password.trim()) {
            setPasswordError('Password cannot be blank');
            return;
        }

        try {

              // Check if the email already exists
        const emailExists = await checkEmailExists(email);

        if (emailExists) {
            setEmailError('Email already exists. Please use a different email.');
            return;
        }

            const userObject = {
                email: email,
                username: username,
                password: password
            }
            await axios.post('/signup', userObject);

            // Reset the form after successful submission
            setEmail('');
            setPassword('');
            setUsername('');
            setVerifyPassword('');
            setPasswordsMatch(true);

            navigate('/login');
        } catch (error) {
            console.error("Error posting user:", error);
            // Handle other errors here
        } 

        
    }

    const checkEmailExists = async (email) => {
        try {
            const response = await axios.get(`/check-email?email=${email}`);
            return response.data.exists;
        } catch (error) {
            console.error("Error checking email existence:", error);
            // Handle error as needed
            return false;
        }
    }

    return (
        <form className="signupform">
            <div className="Signup">
                <div className="Signup_container">
                    <div>
                        <h1 className="Signup_header">Sign Up</h1>
                    </div>
                    <div className="Signup_input_container">
                        <div className="Signup_input">
                            <input
                                value={username}
                                placeholder="Enter your username"
                                onChange={handleUsername}
                                className="Signup_input_field"
                            />
                            {/* Display username error message after submission */}
                            {submitted && !username.trim() && <div className="Signup_error">Username cannot be blank</div>}
                        </div>
                        <div className="Signup_input">
                            <input
                                value={email}
                                placeholder="Enter your email"
                                onChange={handleEmail}
                                className="Signup_input_field"
                            />
                            {/* Display email error message after submission */}
                            {submitted && emailError && <div className="Signup_error">{emailError}</div>}
                        </div>
                        <div className="Signup_input">
                            <input
                                value={password}
                                placeholder="Enter your password"
                                type="password"
                                onChange={handlePassword}
                                className="Signup_input_field"
                            />
                            {/* Display password error message after submission */}
                            {submitted && passwordError && <div className="Signup_error">{passwordError}</div>}
                        </div>
                        <div className="Signup_input">
                            <input
                                value={verifyPassword}
                                placeholder="Verify your password"
                                type="password"
                                onChange={handleVerifyPassword}
                                className="Signup_input_field"
                            />
                        </div>
                        {/* Display error message if passwords do not match after submission */}
                        {submitted && !passwordsMatch && (
                            <div className="Signup_error">Passwords do not match</div>
                        )}
                        <div className="button-place">
                            <button
                                className="Signup_button"
                                onClick={handleSubmit}
                            >
                            Register
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}