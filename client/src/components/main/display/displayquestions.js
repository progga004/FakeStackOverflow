import axios from "axios";
import React, { useState, useEffect,useCallback } from "react";
import Datehelper from "./datehelper";
axios.defaults.baseURL = "http://localhost:8000"; // Update with your server URL

export default function Displayquestions({
  sortOption,
  onQuestionClick,
  questionsProp,
  searchInput,
  onQuestionsCountChange,
  
}) {
  const [fetchedQuestions, setFetchedQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;
  const sortAndFilterQuestions = useCallback((questions) => {
    let sortedQuestions = [...questions];

    if (sortOption === "newest") {
      sortedQuestions.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
    } else if (sortOption === "active") {
      sortedQuestions.sort((a, b) => {
        let aRecent = a.answers.reduce((latest, ans) => Math.max(latest, new Date(ans.ans_date).getTime()), 0);
        let bRecent = b.answers.reduce((latest, ans) => Math.max(latest, new Date(ans.ans_date).getTime()), 0);
        return bRecent - aRecent;
      });
    } else if (sortOption === "unanswered") {
      sortedQuestions = sortedQuestions.filter((question) => question.answers.length === 0);
    }


    return sortedQuestions;
  }, [sortOption]);

  const handleTitleClick = (question) => {
    // This function is triggered when a question title is clicked.
    onQuestionClick(question);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/getQuestions");

        let sortedQuestions = response.data;

        // searching by text or by tags
        if (searchInput !== "") {
          const tagsInSquareBrackets = searchInput.match(/\[[^\]]+\]/g) || [];
          const textKeywords = searchInput
            .replace(/\[[^\]]+\]/g, "")
            .trim()
            .split(/\s+/)
            .filter((keyword) => keyword.length);

          // Create arrays to keep track of matching questions
          let questionsMatchingTags = [];
          let questionsMatchingKeywords = [];

          // Filter questions based on tags
          if (tagsInSquareBrackets.length > 0) {
            const tagNames = tagsInSquareBrackets.map((tag) =>
              tag.slice(1, -1).trim().toLowerCase()
            );
            questionsMatchingTags = sortedQuestions.filter((question) =>
              question.tags.some((tag) =>
                tagNames.includes(tag.name.toLowerCase())
              )
            );
          }

          // Filter based on text keywords
          if (textKeywords.length > 0) {
            questionsMatchingKeywords = sortedQuestions.filter((question) =>
              textKeywords.some((keyword) => {
                const escapedKeyword = keyword.replace(
                  /[.*+?^${}()|[\]\\]/g,
                  "\\$&"
                ); // Escape special characters
                const keywordRegExp = new RegExp(escapedKeyword, "i"); // Case-insensitive search
                return (
                  keywordRegExp.test(question.title) ||
                  keywordRegExp.test(question.text)
                );
              })
            );
          }

          // Combine tag and keyword results, filtering out duplicates
          sortedQuestions = [
            ...questionsMatchingTags,
            ...questionsMatchingKeywords,
          ].filter(
            (question, index, array) =>
              array.findIndex((q) => q._id === question._id) === index
          );
          setCurrentPage(1);
        }
        setFetchedQuestions(sortAndFilterQuestions(sortedQuestions));
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    if (questionsProp && questionsProp.length > 0) {
      setFetchedQuestions(sortAndFilterQuestions(questionsProp));
      console.log("Is it wokring");
    } else {
      fetchData();
    }
  }, [sortOption, questionsProp, searchInput,sortAndFilterQuestions]);

  // Calculate the indexes of the first and last questions for the current page
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  // Slice the array to get the questions for the current page
  const currentQuestions = fetchedQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  // Pagination handlers
  //const nextPage = () => setCurrentPage((prev) => prev + 1);
  const nextPage = () => {
    if (indexOfLastQuestion >= fetchedQuestions.length) {
      setCurrentPage(1); // Go back to the first page
    } else {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
 



  // Use the prop 'questionsProp' if it exists, otherwise use the fetched questions
  const questionsToDisplay = fetchedQuestions;
  


  useEffect(() => {
    if (onQuestionsCountChange) {
      onQuestionsCountChange(questionsToDisplay.length);
    }
  }, [questionsToDisplay, onQuestionsCountChange]); // Add questionsToDisplay as a dependency

  return (
    <>
      {currentQuestions.length > 0 ? (
        currentQuestions.map((question) => (
          <div className="question-box" key={question._id}>
            <div className="question-ans-view">
            <div className="question-views">{question.votes} votes</div>
              <div className="question-ans">
                {question.answers.length} answers
              </div>
              <div className="question-views">{question.views} views</div>
             
            </div>
            <div
              className="question-title"
              onClick={() => handleTitleClick(question)}
            >
              {question.title}
            </div>
            <div className="question-askedby">{question.asked_by.username}</div>
            <div className="question-ansdate">
              asked <Datehelper date={question.ask_date_time} />
            </div>
            <div className="question-summary">
            {question.summary} {/* Display summary here */}
          </div>
            <div className="question-tags">
              {question.tags.map((tag) => (
                <span className="tags" key={tag._id}>
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="no-questions-found">
          <h3>No Questions Found</h3>
        </div>
      )}
      {/* Pagination controls */}
<div className="pagination-container">
  <button className="pagination-button" onClick={prevPage} disabled={currentPage === 1}>
    Previous
  </button>
  <div className="page-number-container">
    <span className="page-number">{currentPage}</span>
  </div>
  <button className="pagination-button" onClick={nextPage}>
    Next
  </button>
</div>

    </>
  );
}
