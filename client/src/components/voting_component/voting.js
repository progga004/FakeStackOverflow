import React from 'react';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import IconButton from '@material-ui/core/IconButton';


const VotingComponent = ({ isGuest, voteCount, onVote, voteErrorMessage, type, itemId }) => {
    const handleVote = (voteType) => {
        onVote(voteType);
    };
   console.log("Votecounts in voting part",voteCount);
   console.log("Error message",voteErrorMessage);
   const voteLabel = voteCount <=1 ? 'vote' : 'votes';
    return (
        <div className="voting-container">
            {isGuest && (
                <>
                    <IconButton onClick={() => handleVote('upvote')}>
                <ThumbUpIcon />
            </IconButton>
                    
                    {/* Always display the vote count */}
                    <span className="vote-count">{voteCount}</span>

                    {/* Conditionally display the error message */}
                    {voteErrorMessage && (
                        <div className="vote-error-message">{voteErrorMessage}</div>
                    )}

            {type !== 'comment' && (
                        <IconButton onClick={() => handleVote('downvote')}>
                            <ThumbDownIcon/>
                        </IconButton>
                    )}
                </>
            )}
            {!isGuest && (
                <span className="vote-count1">{voteCount} {voteLabel}</span>
            )}
        </div>
    );
};


export default VotingComponent;
