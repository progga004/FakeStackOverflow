import React, {  useState, useRef,useEffect } from "react";
import axios from "axios";
import TagsError from "../../error/tagserror";
import Titlerror from "../../error/titlerror";
import Texterror from "../../error/texterror";
import Summaryerror from "../../error/summaryerror";
axios.defaults.baseURL = "http://localhost:8000"; // Update with your server URL

export default function Questionform({ toggleShowForm,editQuestion,userId }) {
  const summaryErrorRef=useRef();
  const [tags, setTags] = useState("");
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await axios.delete(`/deleteQuestion/${editQuestion._id}`);
        alert("Question deleted successfully");
        // Redirect or update the state as necessary
        window.location.href = '/fakeStackOverflow'; // Redirect to the homepage or appropriate page
      } catch (error) {
        console.error("Error deleting question:", error);
        alert("Failed to delete the question");
      }
    }
  };
  
  const handleTagsChange = (event) => {
    setTags(event.target.value);
};




  const [title, setTitle] = useState("");
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const [text, setText] = useState("");
  const handleTextChange = (event) => {
    setText(event.target.value);
  };
  
  const [summary, setSummary] = useState("");
  const handleSummaryChange = (event) => {
    setSummary(event.target.value);
  };
  
  const [textError, settextError] = useState("");
  const [titleError, settitleError] = useState("");
  const [tagsError, settagsError] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [submissionAttempted, setSubmissionAttempted] = useState(false);

  const postedTagIds = [];
  
  const postTagsToServer = async (tagArray) => {
    try {
        for (const tag of tagArray) {
            const response = await axios.post("/postTags", { name: tag });
            postedTagIds.push(response.data._id);
        }
        console.log("Tags posted successfully");
        return null;
    } catch (error) {
        console.error("Error posting tags:", error);
        return error.response.data.message;
    }
};

  
  
  
  const textErrorRef = useRef();
  console.log("Am I getting the edited question",editQuestion);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionAttempted(true);

    console.log("Submitting tags:", tags);
    

    // Force text validation and check if it's valid
    const isTextValid = textErrorRef.current.forceValidate();

    // Check if username is provided
   
    if (!title.trim()) {
      settitleError("Question title cannot be empty");
      return; // Stop form submission if title is empty
    } else if (title.length > 50) {
      settitleError("Question title cannot exceed more than 50 characters");
      return; // Stop form submission if title is too long
    } else {
      settitleError(""); // Clear any existing title error
    }

    
    const isSummaryValid = summaryErrorRef.current.forceValidate();
    if(!isSummaryValid)
    {
      return;
    }
    const tagArray = tags.split(/\s+/).filter(tag => tag.trim() !== "");

    if (tagArray.length === 0) {
      settagsError("Tags cannot be empty");
      return; // Stop form submission if tags are empty
    } else if (tagArray.length > 5) {
      settagsError("Cannot have more than 5 tags");
      return; // Stop form submission if there are too many tags
    } else if (tagArray.some((tag) => tag.length > 10)) {
      settagsError("Each tag should be 10 characters or less");
      return; // Stop form submission if any tag is too long
    } else {
      settagsError(""); // Clear any existing tags error
    }

    // Check if text is valid
    if (!isTextValid) {
      // If text is not valid, stop the form submission
      return;
    }
   const tagIds = await postTagsToServer(tagArray);
   console.log(tagIds);
    // Construct the question object with tag IDs
    const questionObject = {
      title: title,
      text: text,
      summary: summary,
      tags: postedTagIds, 
      
      ask_date_time: Date(), 
    };

    // Send a POST request to create the question
    try {
      let response;
      // this part for editing part

      if(editQuestion && editQuestion._id)
      {
        response = await axios.put(`/updateQuestion/${editQuestion._id}`, questionObject);
      console.log("Question updated successfully:", response.data);
      }
      else
      {
      const response = await axios.post("/postQuestions", questionObject);
      }
      // Clear the input fields
      setTitle("");
      setText("");
      setTags("");
     
      setSummary("");

      // Toggle back to the main content page
      toggleShowForm();
      window.location.reload(); // Trigger a page refresh
      console.log("Question posted successfully:", response.data);
    } catch (error) {
      console.error("Error posting question:", error);
    }
  };
  //for editing the question user part
  useEffect(() => {
    if (editQuestion && editQuestion._id) {
      setTitle(editQuestion.title || '');
      setText(editQuestion.text || '');
      setSummary(editQuestion.summary || '');

      // Fetch and set tags and their IDs
      const fetchTagNamesAndIds = async () => {
        const tagsData = await Promise.all(
          editQuestion.tags.map(async (tagId) => {
            try {
              const response = await axios.get(`/getTagName/${tagId}`);
              return { name: response.data.name, id: tagId };
            } catch (error) {
              console.error('Error fetching tag name:', error);
              return { name: '', id: '' };
            }
          })
        );
        setTags(tagsData.map(tag => tag.name).filter(name => name).join(" "));
      
      };

      fetchTagNamesAndIds();
    }
  }, [editQuestion]);

  
  
  return (
    <div className="Questionformbody">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="questionTitle">
            <h2>
              Question Title<span className="required">*</span>
            </h2>
          </label>
          <span className="italic">100 characters or less</span>
          <textarea
            id="questionTitle"
            name="questionTitle"
            rows={1}
            value={title}
            onChange={handleTitleChange}
          />
          {/* <Titlerror title={title} /> */}
          <Titlerror
            title={title}
            showError={submissionAttempted}
            onTitleError={settitleError}
          />
          {titleError && <div className="error">{titleError}</div>}
          <label htmlFor="questionText">
            <h2>
              Question Text<span className="required">*</span>
            </h2>
          </label>
          <span className="italic">Add details</span>
          <textarea
            id="questionText"
            name="questionText"
            rows={4}
            value={text}
            onChange={handleTextChange}
          />

          <Texterror
            ref={textErrorRef}
            text={text}
            showError={submissionAttempted}
            onTextError={settextError}
          />
          {textError && <div className="error">{textError}</div>}

          <label htmlFor="questionSummary">
          <h2>
            Question Summary<span className="required">*</span>
          </h2>
        </label>
        <span className="italic">140 characters or less</span>
        <textarea
          id="questionSummary"
          name="questionSummary"
          rows={1}
          value={summary}
          onChange={handleSummaryChange}
        />
        
        <Summaryerror
            ref={summaryErrorRef}
            summary={summary}
            showError={submissionAttempted}
            onSummaryError={setSummaryError}
          />

        {summaryError && <div className="error">{summaryError}</div>}
          <label htmlFor="tags">
            <h2>
              Tags<span className="required">*</span>
            </h2>
          </label>
          <span className="italic">Add keywords separated by whitespace</span>
          <textarea
            id="tags"
            name="tags"
            rows={1}
            value={tags}
            onChange={handleTagsChange}
          />
          {/* <TagsError tags={tags} /> */}
          <TagsError
            tags={tags}
            showError={submissionAttempted}
            onTagsError={settagsError}
          />
          {tagsError && <div className="error">{tagsError}</div>}
         
         
          <div className="Postquestion">
            <button className="Postquestionbutton" type="submit">
              Post Question
            </button>
          </div>
          <div className="Requiredtext">
            <p>* Indicated mandatory fields</p>
          </div>
          {
  editQuestion && editQuestion._id && (
    <button
      type="button" 
      className="DeleteQuestionButton"
      onClick={handleDelete}
    >
      Delete Question
    </button>
  )
}

        </form>
      </div>
    </div>
  );
}
