import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Protected = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch protected content from the backend
    axios.get('/protected')
      .then(response => {
        setMessage(response.data.message);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching protected content:', error.response ? error.response.data : error.message);
        setLoading(false);
      });
  }, []); // Run this effect only once on component mount

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Protected Content</h2>
      <p>{message}</p>
    </div>
  );
};

export default Protected;
