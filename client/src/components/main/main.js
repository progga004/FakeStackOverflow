import React from "react";
import Maincontent from "./maincontent";

/**
 * @function this will render the main portion of the client webpage
 * @params none
 * @returns buttons, question display, tags display, ask and answer form.
 */

export default function Main({
  displayContent,
  selectedQuestion,
  onQuestionSelect,
  setDisplayContent,
  tagQuestions,
  setTagQuestions,
  searchInput,
  clearSearchInput,
  setSearchInput,
  showForm,
  toggleShowForm,
  sort,
  onSortChange,
  isGuest,
  viewingUserAnswers,
  setViewingUserAnswers,
  selectedUserId
}) {
  return (
    <Maincontent
      displayContent={displayContent}
      setDisplayContent={setDisplayContent}
      selectedQuestion={selectedQuestion}
      onQuestionSelect={onQuestionSelect}
      tagQuestions={tagQuestions}
      setTagQuestions={setTagQuestions}
      searchInput={searchInput}
      clearSearchInput={clearSearchInput}
      setSearchInput={setSearchInput}
      toggleShowForm={toggleShowForm}
      showForm={showForm}
      sort={sort}
      onSortChange={onSortChange}
      isGuest={isGuest}
      viewingUserAnswers={viewingUserAnswers}
      setViewingUserAnswers={setViewingUserAnswers}
      selectedUserId={selectedUserId}
      
    />
  );
}
    
      
   