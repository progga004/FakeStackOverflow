import React from 'react';

const Comment = ({ comment, voteComponent }) => {
  return (
    <div className="comment-container">
      <div className="vote-section">
        {voteComponent}
      </div>
      <div className="content-section">
        <p>{comment.content}</p>
      </div>
      <div className="username-section">
        <p> {comment.createdBy.username}</p>
      </div>
    </div>
  );
};

export default Comment;