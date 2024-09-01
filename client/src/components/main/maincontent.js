import React, { useState,useEffect } from "react";
import Questionform from "./form/questionform";
import Questionpanel from "./questionpanel/questionpanel";
import Sortpanel from "./sortpanel/sortpanel";
import Displayquestions from "./display/displayquestions";
import Answerpage from "./questiondetails/answerpage";
import Tagpage from "./tagdetails/tagpage";
import AdminUserList from "../Admin/adminprofile";
import Userprofilepage from "../user/userprofilepage";


/**
 * @returns the buttons and text needed for the main content area of website
 */
export default function Maincontent({displayContent,
  selectedQuestion,
  onQuestionSelect,
  setDisplayContent,
  tagQuestions,
  searchInput,
  setTagQuestions,clearSearchInput,setSearchInput,showForm,
  toggleShowForm,sort,onSortChange,isGuest,viewingUserAnswers,setViewingUserAnswers,selectedUserId}) {

const handleQuestionClick = (question) => {
    onQuestionSelect(question);
  };
  const [displayedQuestionsCount, setDisplayedQuestionsCount] = useState(0);

  const handleQuestionsCountChange = (count) => {
    setDisplayedQuestionsCount(count);
  };
  const [editQuestion,setEditQuestion]=useState({})
  const handleEditQuestionSelect = (editquestion) => {
    // Logic to set the selected question for editing
    setEditQuestion(editquestion);
    toggleShowForm(true); // Show the form for editing
    setDisplayContent('answer'); 
  };
  
  const[userId,setUserId]=useState(null)
  const[answerQuestion,setAnswerQuestion]=useState({});
  const handleAnswerQuestionSelect = (answerquestion) => {

     setAnswerQuestion(answerquestion);
     setViewingUserAnswers(true);
  }
  const toggleSort = (option) => {
   onSortChange(option)
  };
  //for user
  const [userTags, setUserTags] = useState(null);
  const handleUserTags = (tags,userData) => {
    setUserTags(tags);
    setUserId(userData);
    console.log("Userdata getting",userData);
    console.log("Am i chnaging the usertags",tags);
    setDisplayContent('userTags');
  };
  const handleTagSelected = (questions) => {
    console.log("Selected tag questions:", questions);
    setTagQuestions(questions);
    setDisplayContent('questions');
};
// Hide the form

useEffect(() => {
  console.log("Updated tagQuestions state:", tagQuestions);
}, [tagQuestions]);
useEffect(() => {
  if (displayContent === 'user') {
    setViewingUserAnswers(false);
    setAnswerQuestion(null);
  }
  if(displayContent!=='user')
  {
    setViewingUserAnswers(false);
  }
}, [displayContent,setViewingUserAnswers]);

console.log("I am fed up",selectedUserId);
// At the beginning of the Maincontent component
useEffect(() => {
  // Whenever displayContent changes and it's required to clear the search input, reset it.
  if (clearSearchInput) {
    setSearchInput('');
  }
}, [clearSearchInput, setSearchInput]);
console.log("Can you tell me",displayContent,selectedQuestion);
return (
    <div className="Maincontent">
      {showForm ? (
        <Questionform toggleShowForm={toggleShowForm}
         editQuestion={editQuestion} userId={selectedUserId}/>
      ) : (
       
        <div>
          {displayContent === 'questions' && selectedQuestion === null && (
            <>
              <Questionpanel toggleShowForm={toggleShowForm} isGuest={isGuest} />
              <Sortpanel onSortChange={toggleSort} totalQuestions={displayedQuestionsCount}/>
              <Displayquestions
                sortOption={sort}
                onQuestionClick={handleQuestionClick}
                questionsProp={tagQuestions || []}
                searchInput={searchInput}
                onQuestionsCountChange={handleQuestionsCountChange}
                clearSearchInput={clearSearchInput}
              />
            </>
          )}
          {displayContent === 'tags' &&(
            
            <Tagpage onTagSelected={handleTagSelected} displayContent={displayContent} isGuest={isGuest}/>
          )}
          {/* {displayContent === 'adminUsers' && (
          <AdminUserList onSelectUser={handleUserSelect} />
        )} */}
          {displayContent === 'userTags' &&(
            
            <Tagpage onTagSelected={handleTagSelected} tags={userTags} displayContent={displayContent} userId={userId}/>
          )}

          {((selectedQuestion != null  && displayContent !== 'tags') || 
          ( answerQuestion && viewingUserAnswers)) && (
            <Answerpage 
              isGuest={isGuest}
              question={selectedQuestion || answerQuestion}
              toggleShowForm={toggleShowForm}
              fromUserProfile={viewingUserAnswers}
              userId={selectedUserId}
            />
        )}

          {
            displayContent==='user' && !viewingUserAnswers && !isGuest &&(
              <Userprofilepage onEditQuestionSelect={handleEditQuestionSelect}
              userId={selectedUserId}
              onAnswerQuestionSelect={handleAnswerQuestionSelect} onTagSelect={handleUserTags}/>
            
            )
          }
        </div>
      )}
    </div>
  );
}

/**
 * Structure of this function
 *    Question Panel:
 *        - this will display the ask Question button and either: "All Questions" or "Search Results"
 *        - this relates to the search critera
 *    Sort Panel:
 *        - this will display the total number of questions from the given search results
 *        -  this also shows the newest, active and unanswered buttons meant for sorting
 */
