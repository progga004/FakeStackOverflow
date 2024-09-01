import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';

const CommentForm = ({ commentableId, onModel, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset error message
    setError('');

    try {
      const response = await axios.post('/api/comments', { content, commentableId, onModel });
      if (response.status === 201) {
        setContent('');
        onCommentAdded();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        // Display server-side error message
        setError(error.response.data.message);
      } else {
        console.error('Error adding comment:', error);
        setError('Error adding comment');
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSubmit(event);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id="filled-search"
        label="Comment"
        type="text"
        variant="filled"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
        multiline
        rows={1}
        style={{ width: '90%' }}
        error={!!error}
        helperText={error}
      />
    </form>
  );
};

export default CommentForm;
