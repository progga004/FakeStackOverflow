import React from 'react';
export default function AnswerQuestion({toggleanswerform}) {

  const handleAnswerButtonClick = () => {
    toggleanswerform();
  };

  return (
    <div>
        <button onClick={handleAnswerButtonClick} className="answer-button">
          Answer Question
        </button> 
    
    </div>
  );
}

