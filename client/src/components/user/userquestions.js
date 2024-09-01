import React, { useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:8000";

const Userquestions = ({ onSelectQuestion, userData }) => { 
    const [questions, setQuestions] = useState([]);
    const [showQuestions, setShowQuestions] = useState(false); 
    useEffect(() => {
      const fetchQuestions = async () => {
        try {
          const response = await axios.get(`/userQuestions/${userData}`);
          setQuestions(response.data);
        } catch (error) {
          console.error('Error fetching questions:', error);
        }
      };
  
      fetchQuestions();
    }, [userData]);
  
    const handleQuestionClick = (question) => {
      onSelectQuestion(question);
    };
  
    return (
      <div>
        <button className ='userPageComponent'onClick={() => setShowQuestions(true)}>View All Questions</button>
        {showQuestions && (
          questions.length > 0 ? (
            questions.map(question => (
              <div key={question._id}>
                <h3 onClick={() => handleQuestionClick(question)}>{question.title}</h3>
              </div>
            ))
          ) : (
            <p><b>No questions posted by this user.</b></p>
          )
        )}
      </div>
    );
}

export default Userquestions;
