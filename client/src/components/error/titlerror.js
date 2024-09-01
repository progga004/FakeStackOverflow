import  { useEffect } from "react";

export default function Titlerror({ title, showError, onTitleError }) {
  useEffect(() => {
    if (showError) {
      if (title.trim() === "") {
        onTitleError('Question title cannot be empty');
      } else if (title.length > 50) {
        onTitleError('Question title cannot exceed more than 50 characters');
      } else {
        onTitleError(''); // Clear any existing error message
      }
    }
  }, [title, showError, onTitleError]);

  return null; // This component does not render anything
}
