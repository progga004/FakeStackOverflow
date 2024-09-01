import React, { useState, useEffect } from "react";
import Header from "./header/header";
import Searchbar from "./header/searchbar/searchbar";
import Main from "./main/main";
import Sidebar from "./sidebar/sidebar";
import AdminUserList from "./Admin/adminprofile";
import { useLocation } from 'react-router-dom'
import { useUser } from "../usercontext";
// /**
//  * This class will only render the Header, Searchbar, Main and Sidebar
//  */

export default function FakeStackOverflow() {
  const [displayContent, setDisplayContent] = useState("questions");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [, setForceUpdate] = useState(false);
  const [tagQuestions, setTagQuestions] = useState(null);
  const [clearSearch, setClearSearch] = useState(false);
  const[sort,setsort]=useState('newest');
  const location = useLocation();
  const [isGuest, setIsGuest] = useState(false);
  const [viewingUserAnswers, setViewingUserAnswers] = useState(false);
  const { isAdmin, user } = useUser();
  console.log("whats the status of admin",isAdmin);
  // for guest users
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const isGuest = queryParams.get('guest') === 'true';
    setIsGuest(isGuest);
  }, [location]);

  useEffect(() => {
    console.log("displayContent changed to:", displayContent);
  }, [displayContent]);
  
  const [showForm, setShowForm] = useState(false); // State to control the visibility of the form

  const hideQuestionForm = () => {
    setShowForm(false); // Set this state to false to hide the form
  };
  const handleDisplayChange = (content, resetTags = false) => {
    setDisplayContent(content);
   
    if (content === "questions") {
      setSelectedQuestion(null); // Reset selected question when 'questions' is clicked
      setSearchInput('');
      
    }
    if (content === "user") {
      if (isAdmin) {
        setDisplayContent('adminUsers');
      } else {
        setSelectedUserId(user ? user.id : null); // Set the user ID for regular users
        setSelectedQuestion(null);
        setViewingUserAnswers(false);
      }
    }

    if(content==='tags')
    {
      setSelectedQuestion(null);
    }

    
    
    if (resetTags) {
      setTagQuestions(null); // Reset tagQuestions only when specified
    }
    setForceUpdate((prev) => !prev);
    
  };
  
  const [searchInput, setSearchInput] = useState(''); // State to store the search input
  
   const handleSearch = (input) =>{
      setSearchInput(input);
      setClearSearch(false); 
      //setClearSearch(true);

   }
   const [selectedUserId, setSelectedUserId] = useState(null);

   const handleUserSelect = (userId) => {
    console.log("Am I getting user id fake",userId);
    setSelectedUserId(userId);
    setSelectedQuestion(null); 
    setDisplayContent('user'); 
    
};
   useEffect(() => {
    // Whenever displayContent changes, clear the search input
    setSearchInput('');
    setClearSearch(true); // Set clearSearch to true to clear the search bar
  
    const timer = setTimeout(() => setClearSearch(false), 0);
  
    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, [displayContent]); // This still depends on displayContent
   
  

  return (
    <div className="Website">
      <div className="Header_section">
        <Header />
        <div className="Search_section">
        <Searchbar onSearch={handleSearch} clearSearch={clearSearch}/>
        </div>
      </div>
      <div className="Sidebar_section">
        <Sidebar onDisplayChange={handleDisplayChange} onHideForm={hideQuestionForm} onSortChange={setsort} isGuest={isGuest} />
      </div>
      <div className="Main_Section">
        {console.log("Rendering Main with displayContent:", displayContent)}
        {displayContent === 'adminUsers' ? (
                    <AdminUserList onSelectUser={handleUserSelect} />
                ) :
        (<Main
          displayContent={displayContent}
          selectedQuestion={selectedQuestion}
          onQuestionSelect={setSelectedQuestion}
          setDisplayContent={setDisplayContent}
          tagQuestions={tagQuestions} // Pass as prop
          setTagQuestions={setTagQuestions}
          searchInput={searchInput}
          clearSearchInput={clearSearch} // Pass the clearSearch as clearSearchInput
          setSearchInput={setSearchInput}
          showForm={showForm} // Pass showForm state down to Main
        toggleShowForm={() => setShowForm(!showForm)}  
        sort={sort} onSortChange={setsort}
        isGuest={isGuest}
        viewingUserAnswers={viewingUserAnswers}
        setViewingUserAnswers={setViewingUserAnswers}
        selectedUserId={selectedUserId}
          
        />
        )}

      </div>
    </div>
  );
}
