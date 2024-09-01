import React, { useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:8000";

const Usertags = ({ onTagSelect, userData }) => {
    const [tags, setTags] = useState([]);
    const [tagsLoaded, setTagsLoaded] = useState(false);

    const handleViewAllTags = async () => {
        try {
            const response = await axios.get(`/userTags/${userData}`);
            setTags(response.data);
            setTagsLoaded(true);
            if (response.data.length > 0) {
                onTagSelect(response.data, userData); // Only call onTagSelect if there are tags
            }
        } catch (error) {
            console.error("Error fetching user tags", error);
            setTagsLoaded(true);
        }  
    };

    return (
        <div>
            <button className='userPageComponent'onClick={handleViewAllTags}>View All Tags</button>
            {tagsLoaded && tags.length === 0 && <p><b>No tags found.</b></p>}
        </div>
    );
};

export default Usertags;
