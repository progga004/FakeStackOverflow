import React, { useState } from "react";
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../usercontext";
import parseJwt from '../utils/parsejwt';

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

export default function StackOverflowLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  //const { setIsAdmin } = useUser();
  const { setUser, setIsAdmin } = useUser();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {

      const response = await axios.post('/login', { email, password });

      const token = response.data.token;

      const jwt = parseJwt(token);
     

      if (jwt) {
        Cookies.set('token', token, { path: '/' });
       
      // Fetch the isAdmin status after successful login
      const statusResponse = await axios.get('/api/user/status');
      setIsAdmin(statusResponse.data.isAdmin);
     
        // Fetch and set user profile
        const profileResponse = await axios.get('/api/user/profile');
        setUser(profileResponse.data); 
        
      
        navigate('/fakeStackOverflow');
      } else {
        console.error('Failed to parse JWT');
      }
    } catch (error) {
      console.error('Login failed:', error);

      if (error.response.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('Login failed. Please try again.');
      }
    } 
  }

  return (
    <div className="StackOverflowLogin">
      <div className="StackOverflowLogin_container">
        <div>
          <h1 className="StackOverflowLogin_header">Login</h1>
        </div>
        <div className="StackOverflowLogin_input_container">
          <div className="StackOverflowLogin_input">
            <input
              value={email}
              placeholder="Enter your email"
              onChange={handleEmailChange}
              className="StackOverflowLogin_input_field"
            />
          </div>
          <div className="StackOverflowLogin_input">
            <input
              value={password}
              placeholder="Enter your password"
              type="password"
              onChange={handlePasswordChange}
              className="StackOverflowLogin_input_field"
            />
          </div>
          {error && <div className="StackOverflowLogin_error">{error}</div>}
          <div>
            <button
              className="StackOverflowLogin_button"
              onClick={handleFormSubmit}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}