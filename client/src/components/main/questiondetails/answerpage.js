import React, { useState } from 'react';
import QuestionDetails from './questiondetails';
import Displayanswers from '../display/displayanswer';
import Questionform from '../form/questionform';
import AnswerForm from '../form/answerform';
import Cookies from 'js-cookie';
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:8000";




const Answerpage = ({ question,isGuest,fromUserProfile,userId }) => {
    const [showAnswerForm, setShowAnswerForm] = useState(false);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [updateCount, setUpdateCount] = useState(0);
    const [answerVoteCounts, setAnswerVoteCounts] = useState({});
    const [questionVoteCount, setQuestionVoteCount] = useState({
      votes: question.votes,
      voteErrorMessage: ""
  });
    const [questionVoteErrorMessage, setQuestionVoteErrorMessage] = useState("");
  
   console.log("I am here answerPage",userId);
    
    const handleNewAnswer = () => { // This will be called when a new answer is added
        setUpdateCount(prev => prev + 1);
        setShowAnswerForm(false);
      }
      if (showQuestionForm) {
        return (
          <Questionform
            toggleShowForm={() => setShowQuestionForm(false)}
          />
        );
    }
    const handleAnswerDeleted = () => {
      setUpdateCount(prev => prev + 1);
  };
  
  const handleVoteUpdate = (itemId, newVotes, errorMessage, type) => {
    if (type === 'answer') {
        setAnswerVoteCounts(prev => ({
            ...prev,
            [itemId]: {
                votes: newVotes !== null ? newVotes : (prev[itemId]?.votes || 0),
                voteErrorMessage: errorMessage
            }
        }));
    } else if (type === 'question') {
        setQuestionVoteCount({
            votes: newVotes !== null ? newVotes : questionVoteCount.votes,
            voteErrorMessage: errorMessage
        });
    }
};

      
  
      return (
        <div>
          {showAnswerForm && !isGuest ? (
            <AnswerForm 
              onSubmit={handleNewAnswer} 
              toggleForm={() => setShowAnswerForm(false)} 
              question={question} 
            />
          ) : (
            <>
              <QuestionDetails 
                isGuest={isGuest}
                question={question} 
                updateCount={updateCount} 
                toggleShowQuestionForm={() => setShowQuestionForm(true)}
                voteCount={questionVoteCount}
                voteErrorMessage={questionVoteErrorMessage}
                handleVoteUpdate={handleVoteUpdate}
                
              />
              <Displayanswers 
                question={question} 
                isGuest={isGuest}
                // toggleShowForm={toggleShowForm} 
                toggleShowAnswerForm={() => setShowAnswerForm(true)}
                onNewAnswer={handleNewAnswer} 
                voteCount={answerVoteCounts}
                handleVoteUpdate={handleVoteUpdate}
                fromUserProfile={fromUserProfile}
                onAnswerDeleted={handleAnswerDeleted}
                userId={userId}
              />
            </>
          )}
        </div>
      );
      
          }
  // Export the component using export default
  export default Answerpage;