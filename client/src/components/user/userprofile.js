import React, { useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.baseURL="http://localhost:8000";

const Userprofile = ({ userData }) => {
    const [userdata, setUserdata] = useState([]);
   console.log("Userdata in usrerprofile",userData);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/userProfile/${userData}`);
                setUserdata(response.data);
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };
    
        if (userData) {
            fetchUserData();
        }
    }, []);
  
    console.log("Whats admin status coming",userdata.isAdmin);
    return (
        <div className='userProfile'>
            <h3>{userdata.username}</h3>
            <p>Member for: {userdata.membershipYears} years</p>
            <p>Reputation: {userdata.reputation}</p>
            {userdata.isAdmin && <p>Admin privileges enabled</p>}
        </div>
    );
};

export default Userprofile;
