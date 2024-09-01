

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Userprofile from './userprofile';
import Userquestions from './userquestions';
import UserAnswers from './useranswers';
import Usertags from './usertags';

const Userprofilepage = ({ userId, onEditQuestionSelect, onAnswerQuestionSelect, onTagSelect }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Fetch user data based on the userId
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/user/${userId}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);
  
    return (
        <>
            {userData && (
                <>
                     <Userprofile userData={userId} />
                    <Userquestions userData={userId} onSelectQuestion={onEditQuestionSelect} />
                     <UserAnswers userData={userId} onQuestionSelect={onAnswerQuestionSelect} />
                    <Usertags userData={userId} onTagSelect={onTagSelect} /> 
                </>
            )}
            {!userData && <div>Loading user data...</div>}
        </>
    );
};

export default Userprofilepage;
