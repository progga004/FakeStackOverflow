import React, { useState, useEffect } from 'react';
import Askquestion from '../buttons/askquestionbutton';
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8000";

export default function Tagdetails({toggleShowQuestionForm,displayContent,tagDeleted, setTagDeleted,userId,isGuest}) {
    const [totalTags, setTotalTags] = useState(0);
    console.log("Usertags in tagsdetails page",userId);
    useEffect(() => {
      const fetchTotalTags = async () => {
          try {
              let response;
              if (displayContent === 'userTags') {
                 response= await axios.get(`/getUserTotalTags/${userId}`);
                  setTotalTags(response.data.totalUserTags);
                  
              } else {
                  response = await axios.get('/getTotalTags');
                  setTotalTags(response.data.totalTags);
              }
          } catch (error) {
              console.error("Error fetching total tags:", error);
          }
      };
  
      fetchTotalTags();
      if (tagDeleted) {
        setTagDeleted(false); 
    }
  }, [displayContent,totalTags,tagDeleted, setTagDeleted]);
  

    

    return (
        <div className="tag-details">
          <div className="Questionpanel">
            <div className="AllQuestions">
              {totalTags} tags &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; All tags
            </div>
            <div className="Results">
              {!isGuest && <Askquestion toggleShowForm={toggleShowQuestionForm} />}
            </div>
          </div>
          
        </div>
      );
    };
