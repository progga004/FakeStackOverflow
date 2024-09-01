import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLocation } from "react-router-dom";


import React from "react";
import axios from 'axios';
import Cookies from 'js-cookie';

axios.defaults.baseURL = "http://localhost:8000"; // Update with your server URL

export default function Logout() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isGuest = queryParams.get('guest') === 'true';

  const handleLogout = () => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    
    
    // Clear the token from localStorage
    localStorage.removeItem('token');
   
    // Clear the token cookie
    Cookies.remove('token');

    // Call the logout endpoint on the server
    axios.post('/logout', {}, { headers: { Authorization: token } })
      .then(response => {
        console.log(response.data.message);
       
        // Navigate to the desired page after successful logout
        navigate('/');
        
      })
      .catch(error => {
        console.log('Logout failed:', error.response.data.message);
        // Handle logout failure, show error message, etc.
      });
  };

  return (
    <div>
    {isGuest
      ? <button onClick={handleLogout}>Please Login or Signup</button>
      : <button onClick={handleLogout}>Logout</button>
    }
  </div>
  );
}
