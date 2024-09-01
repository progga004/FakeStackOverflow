import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:8000";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        // Make a request to the server to clear the session or token
        await axios.post('/logout');

        // Remove the token from the client-side (assuming it's stored in a cookie)
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // Redirect to the welcome page or login page
        navigate('/welcome'); // Change to your desired route
      } catch (error) {
        console.error('Logout failed:', error.response.data);
        // Handle logout failure, show an error message, etc.
      }
    };

    logout();
  }, [navigate]);

  return (
    <div>
      Logging out...
    </div>
  );
};

export default Logout;
