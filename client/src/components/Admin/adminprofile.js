import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUserList = ({ onSelectUser }) => {
    const [users, setUsers] = useState([]);
    const [adminProfile, setAdminProfile] = useState(null);

    useEffect(() => {
        // Fetch admin's own profile
        const fetchAdminProfile = async () => {
            try {
                const response = await axios.get('/api/admin');
                setAdminProfile(response.data);
            } catch (error) {
                console.error('Error fetching admin profile', error);
            }
        };

        // Fetch non-admin users
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users');
                const nonAdminUsers = response.data.filter(user => !user.isAdmin);
                setUsers(nonAdminUsers);
            } catch (error) {
                console.error('Error fetching users', error);
            }
        };

        fetchAdminProfile();
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user and all associated content?")) {
            try {
                await axios.delete(`/api/users/${userId}`); 
                setUsers(users.filter(user => user._id !== userId));
            } catch (error) {
                console.error('Error deleting user', error);
            }
        }
    };

    return (
        <div>
            {adminProfile && (
                <div>
                    <h3>Admin Profile: {adminProfile.username}</h3>
                    <p>Reputation: {adminProfile.reputation}</p>
                    <p>Member for: {adminProfile.membershipYears} years</p>
                </div>
            )}
            <hr />
            {users.length > 0 ? (
                users.map(user => (
                    <div key={user._id}>
                        <button onClick={() => onSelectUser(user._id)}>{user.username}</button>
                        <button onClick={() => handleDelete(user._id)}>Delete</button>
                        <hr/>
                    </div>
                ))
            ) : (
                <p>No users found in the system.</p>
            )}
        </div>
    );
};

export default AdminUserList;

