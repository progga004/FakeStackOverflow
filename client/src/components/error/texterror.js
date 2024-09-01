import { useEffect, useImperativeHandle, forwardRef, useCallback } from "react";

function Texterror({ text, showError, onTextError }, ref) {
  // Define the validateText function using useCallback
  const validateText = useCallback(() => {
    let isValid = true; // Initialize as true

    if (text.trim() === "") {
      onTextError("Text cannot be empty");
      isValid = false; // Set to false if text is empty
    } else {
      const hyperlinkPattern = /\[([^\]]+)]\(([^)]*)\)/g;
      let errorMessages = [];
      let foundHyperlink = false;
      let match;
      while ((match = hyperlinkPattern.exec(text)) !== null) {
        foundHyperlink = true;
        const linkText = match[1];
        const url = match[2].trim();

        if (url === "") {
          errorMessages.push(`Missing URL for "${linkText}".`);
          isValid = false; // Set to false if URL is missing
        } else if (!(url.startsWith("http://") || url.startsWith("https://"))) {
          errorMessages.push(`Invalid URL format for "${linkText}".`);
          isValid = false; // Set to false if URL format is invalid
        }
      }

      if (!foundHyperlink) {
        onTextError(""); // No error if no hyperlink is found
      } else if (!isValid) {
        onTextError(errorMessages.join(" ")); // Set the error message for invalid hyperlinks
      } else {
        onTextError(""); // Clear error if all hyperlinks are valid
      }
    }

    return isValid; // Return the validity status
  }, [text, onTextError]); // Add dependencies here

  useEffect(() => {
    if (showError) {
      validateText();
    }
    // Run validation on mount and when dependencies change
  }, [text, showError, onTextError, validateText]); // Include validateText in the dependency array

  useImperativeHandle(ref, () => ({
    forceValidate: () => validateText(), // Expose forceValidate method
  }));

  return null; // This component does not render anything
}

export default forwardRef(Texterror);
