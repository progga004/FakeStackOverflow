import React, { useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:8000";

const UserAnswers = ({onQuestionSelect,userData}) => {
    const [answers, setAnswers] = useState([]);
    const [showAnswers, setShowAnswers] = useState(false);

    console.log("here in useranswer",userData);
    
    useEffect(() => {
        const fetchAnswers = async () => {
          try {
            const response = await axios.get(`/answeredQuestions/${userData}`);
            console.log("Useranswers",response.data);
            setAnswers(response.data);
          } catch (error) {
            console.error('Error fetching answers:', error);
          }
        };
    
        fetchAnswers();
      }, [showAnswers]);
      

      return (
        <div>
            <button className='userPageComponent' onClick={() => setShowAnswers(true)}>View All Answers</button>
            {showAnswers && (
                answers.length > 0 ? (
                    answers.map((item, index) => (
                        <div key={index} className="question-box">
                            <div onClick={() => onQuestionSelect(item.question)}>
                                {item.question.title}
                            </div>
                            {/* Other answer details */}
                        </div>
                    ))
                ) : (
                    <p>No answers found for this user.</p>
                )
            )}
        </div>
    );
};

export default UserAnswers;
