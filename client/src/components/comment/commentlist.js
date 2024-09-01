import React, { useState, useEffect } from 'react';
import Comment from './comment';
import axios from 'axios';
import VotingComponent from '../voting_component/voting';
import Divider from '@material-ui/core/Divider';
axios.defaults.baseURL = "http://localhost:8000";

const CommentsList = ({ commentableId, onModel,updateCommentCount,isGuest }) => {
    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [voteErrorMessage, setVoteErrorMessage] = useState("");
    console.log("Commentable id",commentableId);
    console.log("Onmodel",onModel);

    useEffect(() => {
        
        const fetchComments = async () => {
            try {
               
                const response = await axios.get(`/api/comments?commentableId=${commentableId}&onModel=${onModel}&page=${currentPage}`);
                const commentsWithErrors = response.data.map(comment => ({
                    ...comment,
                    voteErrorMessage: "" // Initialize an error message field for each comment
                }));
                setComments(commentsWithErrors);

            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [commentableId, onModel, currentPage,updateCommentCount]);
    console.log("Comments after fetching",comments)
    const handleVote = async (itemId) => {
        try {
            const response = await axios.post(`/api/comments/${itemId}/upvote`, {}, { withCredentials: true });
            setComments(prevComments => prevComments.map(comment => {
                if (comment._id === itemId) {
                    return {
                        ...comment,
                        votes: response.data.message ? comment.votes : response.data.votes,
                        voteErrorMessage: response.data.message || ""
                    };
                }
                return comment;
            }));
        } catch (error) {
            console.error("Error processing vote:", error);
            setComments(prevComments => prevComments.map(comment => {
                if (comment._id === itemId) {
                    return { ...comment, voteErrorMessage: "Error processing vote" };
                }
                return comment;
            }));
        }
    };
    

    const handlePrev = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        if (comments.length < 3) {  
            setCurrentPage(1);  
        } else {
            setCurrentPage(prev => prev + 1);
        }
    };


return (
    <div>
        {comments.map((comment, index) => (
                <React.Fragment key={comment._id}>
                    <Comment 
                      comment={comment} 
                      voteComponent={
                        <VotingComponent
                          isGuest={!isGuest}
                          voteCount={comment.votes}
                          onVote={() => handleVote(comment._id)}
                          type="comment"
                          itemId={comment._id}
                          voteErrorMessage={comment.voteErrorMessage}
                        />
                      } 
                    />
                    {index < comments.length - 1 && <Divider style={{ height: '2px', backgroundColor: '#000' }} />}
                </React.Fragment>
            ))}
        
        <div className="button-container">
    <button onClick={handlePrev}>Prev</button>
    <button onClick={handleNext}>Next</button>
  </div>
    </div>
);
};

export default CommentsList;
