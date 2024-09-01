import axios from "axios";
import React, { useState, useEffect } from "react";
import Datehelper from "../display/datehelper";
import Askquestion from "../buttons/askquestionbutton";
import { linkifyText } from "../../utils/linkifytext";
import VotingComponent from "../../voting_component/voting";
import CommentForm from "../../comment/commentform";
import CommentsList from "../../comment/commentlist";
import Divider from '@material-ui/core/Divider';
axios.defaults.baseURL = "http://localhost:8000";


const QuestionDetails = ({
  question,
  updateCount,
  toggleShowQuestionForm,
  isGuest,
 voteCount,
 voteErrorMessage,
 handleVoteUpdate
  
}) => {
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [questionDetails, setQuestionDetails] = useState(null);
  const [updateCommentCount, setUpdateCommentCount] = useState(0);

    const handleCommentAdded = () => {
        setUpdateCommentCount(prev => prev + 1);
    };

  useEffect(() => {
    // Fetch the updated question details from the server
    axios
      .get(`/getQuestionDetails/${question._id}`)
      .then((response) => {
        setQuestionDetails(response.data);
        console.log("isGuest", isGuest);
      })
      .catch((error) => {
        console.error("Error fetching question details:", error);
      });
  }, [question._id,updateCount]);

  useEffect(() => {
    // Fetch the total number of answers from the server
    axios
      .get(`/getTotalAnswers/${question._id}`)
      .then((response) => {
        setTotalAnswers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching total questions:", error);
      });
  }, [question._id,updateCount]);
  const handleVote = async (voteType, itemId) => {
    try {
        const postData = {
            voteType: voteType,
            type: 'question' 
        };
        const response = await axios.post(`/vote/${itemId}`, postData, { withCredentials: true });
        console.log("Question votes",response.data.votes);
        if (response.data.message) {
            handleVoteUpdate(itemId, null, response.data.message, 'question');
        } else {
            handleVoteUpdate(itemId, response.data.votes, "", 'question');
        }
    } catch (error) {
        console.error("Error processing vote:", error);
        handleVoteUpdate(itemId, null, "Error processing vote", 'question');
    }
  };

  
 console.log("I am here in the question detail part",question);

  if (!question) {
    return <div></div>;
  }

  return (
    <div className="question-details">
      <div className="Questionpanel">
        <div className="AllQuestions">
          {totalAnswers} answers &nbsp; &nbsp; {question.title}
        </div>
        <div className="Results">
          {!isGuest && <Askquestion toggleShowForm={toggleShowQuestionForm} />}
        </div>
      </div>
      <div>
        {questionDetails && ( // Adding a check here to ensure questionDetails is not null
          <>
           
            <div className="questionview">{questionDetails.views} views</div>
            <VotingComponent
        isGuest={!isGuest}
        voteCount={voteCount.votes}
        onVote={(voteType) => handleVote(voteType, question._id)}
        type="question"
        itemId={question._id}
        voteErrorMessage={voteCount.voteErrorMessage}
      />
            
            <div className="questiontext">
              {linkifyText(questionDetails.text)}
            </div>
            <div className="question-tags" id="question-tags">
              {question.tags.map((tag) => (
                <span className="tags" key={tag._id}>
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="text-with-border-box">
              <div className="questionaskedby">{questionDetails.asked_by.username}</div>
              <div className="questionaskdate">
                asked{" "}
                <Datehelper date={questionDetails.ask_date_time}></Datehelper>
              </div>
            </div>
           
          </>
        )}
      </div>
      <div className="question-comments-section">
        {/* Comment Form for adding a new comment */}
       
        <div className="divider-section">
                <Divider style={{ height: '2px', backgroundColor: '#000' }} />
            </div>
            <h2 class="commentname">Comments</h2>
        
        {/* List of comments */}
        <CommentsList
          isGuest={isGuest}
          commentableId={question._id}
          onModel="Question"
          updateCommentCount={updateCommentCount}
          
        />
       {!isGuest &&
        <CommentForm 
          commentableId={question._id}
          onModel="Question"
          onCommentAdded={handleCommentAdded}
         
        />
       }
        
      </div>
    </div>
  );
};

export default QuestionDetails;
