import axios from "axios";
import React, { useState, useEffect } from "react";
import Datehelper from "./datehelper";
//import QuestionDetails from "../questiondetails/questiondetails";
import AnswerQuestion from "../buttons/answerquestion";
import AnswerForm from "../form/answerform";
import { linkifyText } from "../../utils/linkifytext";
import VotingComponent from "../../voting_component/voting";
import CommentsList from "../../comment/commentlist";
import CommentForm from "../../comment/commentform";
import Divider from '@material-ui/core/Divider';

axios.defaults.baseURL = "http://localhost:8000";

export default function Displayanswers({
  question,
  toggleShowAnswerForm,
  isGuest,
  handleVoteUpdate,
  voteCount,
  fromUserProfile,
  onAnswerDeleted,
  userId
  
}) {
  console.log("Am I here in displayanswer prt",question);
  const [answer, setAnswer] = useState([]);
  const [showForm, setForm] = useState(false);
  const answersPerPage = 5;
  const [updateCommentCount, setUpdateCommentCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
console.log("Answer id coming",userId);
    const handleCommentAdded = () => {
        setUpdateCommentCount(prev => prev + 1);
    };
  const toggleanswerform = () => {
    setForm(!showForm);
  };

  useEffect(() => {
    const fetchData = async () => {
      const currentQuestionId = question._id;
      //let endpoint = `/getAnswers/${currentQuestionId}`;
      const endpoint = fromUserProfile ? `/getUserPrioritizedAnswers/${currentQuestionId}` : `/getAnswers/${currentQuestionId}`;
      try {
        let response;
        let sortedAnswers;
        if(fromUserProfile)
        {
          response = await axios.get(endpoint,{
            headers: {
              'userid': userId // Include the user ID in the request headers
            }});
          //console.log(" I am here in display answer partWhat are teh sorted answers",sortedAnswers);

         sortedAnswers=response.data;
          setAnswer(sortedAnswers);
        }
       else{
         response = await axios.get(endpoint);
        console.log("What are teh sorted answers",sortedAnswers);

        sortedAnswers=response.data;
         sortedAnswers=response.data.sort((a, b) => new Date(b.ans_date) - new Date(a.ans_date));

         setAnswer(sortedAnswers);
       }


  
        // Initialize and update votes for each answer
        const initialAnswerVoteCounts = {};
        response.data.forEach(answer => {
          initialAnswerVoteCounts[answer._id] = {
            votes: answer.votes,
            voteErrorMessage: ""
          };
        });
        sortedAnswers.forEach(answer => {
          handleVoteUpdate(answer._id, answer.votes, "", 'answer');
        });
      } catch (error) {
        console.error("Error fetching answers:", error);
      }
    };
  
    fetchData();
  }, [question, fromUserProfile]);
  
  const handleVote = async (voteType, itemId) => {
    try {
        const postData = {
            voteType: voteType,
            type: 'answer'
        };
        const response = await axios.post(`/vote/${itemId}`, postData, { withCredentials: true });
        console.log("Answer Votes",response.data.votes);
        if (response.data.message) {
            handleVoteUpdate(itemId, null, response.data.message, 'answer');
        } else {
            handleVoteUpdate(itemId, response.data.votes, "", 'answer');
        }
    } catch (error) {
        console.error("Error processing vote:", error);
        handleVoteUpdate(itemId, null, "Error processing vote", 'answer');
    }
};

const [editingAnswer, setEditingAnswer] = useState(null);
const handleEditAnswer = (answer) => {
  console.log("Editing answer get changed",answer);
  setEditingAnswer(answer);
  setForm(!showForm);
};

const handleAnswerUpdated = (updatedAnswer) => {
  // Update the specific answer in the state
  const updatedAnswers = answer.map(ans => 
    ans._id === updatedAnswer._id ? updatedAnswer : ans
  );
  setAnswer(updatedAnswers);
};
const handleDeleteAnswer = async (answerId) => {
  try {
    //await axios.delete(`/deleteAnswer/${answerId}`, { withCredentials: true });
    await axios.delete(`/deleteAnswer/${answerId}`, {
      withCredentials: true,
      headers: { 'userid': userId } 
    });
    const updatedAnswers = answer.filter(ans => ans._id !== answerId);
    setAnswer(updatedAnswers);
    if (onAnswerDeleted) {
      onAnswerDeleted();
    }
  } catch (error) {
    console.error("Error deleting answer:", error);
   
  }
};

  if (!question) {
    return <div></div>;
  }
  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  // Slice the array to get the questions for the current page
  const currentAnswer = answer.slice(
    indexOfFirstAnswer,
    indexOfLastAnswer
  );
  const nextPage = () => {
    if (indexOfLastAnswer >= answer.length) {
      setCurrentPage(1); // Go back to the first page
    } else {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
 

return (
  <>
    {showForm ? (
      <AnswerForm toggleForm={toggleanswerform} question={question} editingAnswer={editingAnswer} onAnswerUpdate={handleAnswerUpdated} userId={userId}/>
    ) : (
      <div> {/* Start of the single parent element */}
        <div className="answerdisplay-section">
          <div className="question-details">
            {/* <QuestionDetails question={question} /> */}
            <div className="answers-border"></div>
          </div>
          <div className="answer-details">
            {currentAnswer.map((answer) => (
              <div className="answer-box" key={answer._id}>
                <div className="answer-content">
                <VotingComponent
                isGuest={!isGuest}
                voteCount={voteCount[answer._id]?.votes || 0}
                onVote={(voteType) => handleVote(voteType, answer._id)}
                type="answer"
                itemId={answer._id}
                voteErrorMessage={voteCount[answer._id]?.voteErrorMessage || ''}
            />
                
        
                  <div className="answertext">{linkifyText(answer.text)}</div>
                  { <div className="ansby">{answer.ans_by.username}</div> }
                  <div className="ansdate">
                    answered <Datehelper date={answer.ans_date} />
                  </div>
                  {fromUserProfile && answer.ans_by._id === userId && (
  <div>
    <button onClick={() => handleEditAnswer(answer)}>Edit</button>
    <button onClick={() => handleDeleteAnswer(answer._id)}>Delete</button>
  </div>
)}
                  <div className="divider-section">
                <Divider style={{ height: '2px', backgroundColor: '#000' }} />
            </div>


                  <div className="question-comments-section">
                 <h2 class="commentname">Comments</h2>
         
          <CommentsList
            isGuest={isGuest}
            commentableId={answer._id}
            onModel="Answer"
            updateCommentCount={updateCommentCount}
          />
          {!isGuest && 
           <CommentForm 
            commentableId={answer._id}
            onModel="Answer"
            onCommentAdded={handleCommentAdded}
          />
}
        </div>
                </div>
                
              </div>
            ))}
            <div className="pagination-container">
  <button className="pagination-button" onClick={prevPage} disabled={currentPage === 1}>
    Previous
  </button>
  <div className="page-number-container">
    <span className="page-number">{currentPage}</span>
  </div>
  <button className="pagination-button" onClick={nextPage}>
    Next
  </button>
</div>

          </div>
         {!isGuest  && !fromUserProfile && <AnswerQuestion toggleanswerform={toggleShowAnswerForm} />}
        </div>
       
      </div> 

    )}
  </>
);

            }