import React, { useState,useRef,useEffect } from "react";
import Texterror from "../../error/texterror";
import axios from "axios";
axios.defaults.baseURL = 'http://localhost:8000'; // Update with your server URL
export default function AnswerForm({ onSubmit,toggleForm,question ,editingAnswer,onAnswerUpdate,userId }) {
  const [answerText, setAnswerText] = useState("");
  
 console.log("Am I opening up?",editingAnswer);
  const handleText = (event) => {
    const inputValue = event.target.value;
    setAnswerText(inputValue);
  };

  
  const[textError, settextError]=useState('');
  const [submissionAttempted, setSubmissionAttempted] = useState(false);
  
  const textErrorRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionAttempted(true);
    // Force text validation and check if it's valid
    const isTextValid = textErrorRef.current.forceValidate();
  
  
    if (!isTextValid) {
      // If text is not valid, stop the form submission
      return;
    }

   
      const answerObject = {
        text: answerText,
        ans_date: Date(),
        questionId: question._id
      };
     
      
    
  
    try {
      let response;

      if(editingAnswer && editingAnswer._id)
      {
        response = await axios.put(`/editAnswer/${editingAnswer._id}`, { newText: answerText }, {
          headers: { 'userid': userId }  
        });
       console.log("Answer updated successfully:", response.data);
       onAnswerUpdate(response.data.updatedAnswer);
      }
      else
      {
      const response = await axios.post("/postAnswers", answerObject);
      setAnswerText("");
      onSubmit(response.data);
      }
      
      toggleForm();
    } catch (error) {
      console.error("Error posting question:", error);
    }
  };

  useEffect(() => {
    if (editingAnswer && editingAnswer._id) {
      setAnswerText(editingAnswer.text || '');
    }
  }, [editingAnswer]);

  
  
  return (
    <div className="Questionformbody">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="answerText">
            <h2>
              Answer Text<span className="required">*</span>
            </h2>
          </label>
          <textarea
           id="answerText"
           name="answerText"
           rows={4}
           value={answerText}
           onChange={handleText}
          />
          {}
          <Texterror ref={textErrorRef} text={answerText} showError={submissionAttempted} onTextError={settextError} />
          {textError && <div className="error">{textError}</div>}
         
          <div className="Postquestion">
            <button className="Postquestionbutton" type="submit">
              Submit
            </button>
          </div>
          <div className="Requiredtext">
            <p>* Indicated mandatory fields</p>
          </div>
        </form>
      </div>
    </div>
  );
}
