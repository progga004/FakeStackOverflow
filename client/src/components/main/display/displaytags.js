import React, { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8000";

export default function Displaytag({onTagSelected,displayContent,setTagDeleted,userId}) {
  const [tagInfo, setTagInfo] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [popup, setPopup] = useState({ visible: false, message: '' });
  const showErrorPopup = (message) => {
    setPopup({ visible: true, message });
};
const Popup = ({ message, onClose }) => (
  <div className="popup">
      <div className="popup-content">
          <p>{message}</p>
          <button onClick={onClose}>Close</button>
      </div>
  </div>
);


  useEffect(() => {
    if (displayContent === 'tags') {
     
      axios.get("/tagsWithQuestionsCount")
        .then((response) => {
          setTagInfo(response.data); 
        })
        .catch((error) => {
          console.error("Error fetching tags with questions count:", error);
        });
    }
    if (displayContent === 'userTags') {
      console.log("Over here",userId);
      // Fetch user specific tags with their related questions count
      axios.get(`/getUserSpecificTagsWithQuestionCount/${userId}`)
        .then((response) => {
          setTagInfo(response.data); // Update the userTags state
        })
        .catch((error) => {
          console.error("Error fetching user-specific tags with questions count:", error);
        });
    }
  }, [displayContent]);
  //just for testing
  const handleTagClick = async (tagName) => {
   let response;
    if(displayContent==='tags'){
    try {
         response = await axios.get(`/getQuestionsByTag/${tagName}`);

        console.log("Response data",response.data);

    } catch (error) {
        console.error("Error fetching questions for tag:", error);
    }
  }
  if(displayContent==='userTags'){
    try {
       response =await axios.get(`/getUserQuestionsByTag/${tagName}?userId=${userId}`)

      console.log("Response data",response.data);
     
  } catch (error) {
      console.error("Error fetching questions for tag:", error);
  }
  }
  onTagSelected(response.data);
};
  function chunkArray(myArray, chunk_size) {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
      let myChunk = myArray.slice(index, index + chunk_size);
      // Do not modify the original array
      if (myChunk.length > 0) {
        tempArray.push(myChunk);
      }
    }

    return tempArray;
  }
  const saveEdit = async (tagId) => {
    try {
      const response = await axios.put(`/editTag/${tagId}`, 
      { newTagName: editMode.name },
      {
          headers: {
              'userid': userId 
          }
      }
  );
        console.log("Tag updated:", response.data);
        
        // Update the tagInfo state to reflect the changes
        const updatedTagInfo = tagInfo.map(tag => {
            if (tag._id === tagId) {
                return { ...tag, name: editMode.name };
            }
            return tag;
        });
        setTagInfo(updatedTagInfo);

        // Exit edit mode
        setEditMode(null);
    } catch (error) {
      console.error("Error updating tag:", error);
      if (error.response && error.response.status === 403) {
          showErrorPopup("Cannot edit tag: It is in use by other users.");
        }
    }
};

const handleDeleteTag = async (tagId) => {
  try {
    const config = {
      headers: {
          'userid': userId, 
      }
  };
      await axios.delete(`/deleteTag/${tagId}`,config);
      setTagInfo(tagInfo.filter(tag => tag._id !== tagId));
      setTagDeleted(true);
  } catch (error) {
      console.error("Error deleting tag:", error);
      if (error.response && error.response.status === 403) {
          showErrorPopup("Cannot delete tag: It is in use by other users.");
      }
  }
};



  // Prepare tags in groups of 3 for rendering in rows
  const tagsInRows = chunkArray(tagInfo, 3);

  return (
    <div>
      {popup.visible && (
            <Popup 
                message={popup.message} 
                onClose={() => setPopup({ visible: false, message: '' })}
            />
        )}
      {/* Here we map over the rows */}
      {tagsInRows.map((row, rowIndex) => (
        <div key={rowIndex} className="tagRow">
          {/* And then map over the tags within each row */}
          {
          row.map((tag) => (
            <div key={tag._id} className="tagItem">
                {editMode && editMode._id === tag._id ? (
                    <div>
                        <input 
                            type="text" 
                            value={editMode.name} 
                            onChange={(e) => setEditMode({...editMode, name: e.target.value})}
                        />
                        <button onClick={() => saveEdit(tag._id)}>Save</button>
                        <button onClick={() => setEditMode(null)}>Cancel</button>
                    </div>
                ) : (
                    <div>
                        <button onClick={(e) => {
                            e.preventDefault();
                            handleTagClick(tag.name);
                        }} className="tagNameButton">
                            {tag.name}
                        </button>
                        <div className="tagCount">
                            {tag.questionsCount} questions
                        </div>
                       {displayContent==='userTags' && 
                       <>
                       <button onClick={() => setEditMode({ _id: tag._id, name: tag.name })}>Edit</button>
                       <button onClick={() => handleDeleteTag(tag._id)}>Delete</button>
                       </>}
                    </div>
                )}
            </div>
        ))}
        
        </div>
      ))}
    </div>
  );
  
  
}
