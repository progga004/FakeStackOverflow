

import { useEffect } from "react";

export default function TagsError({ tags, showError, onTagsError }) {
  console.log("Tags received in TagsError:", tags);

  useEffect(() => {
    // Split the tags string into an array of individual tags
    const tagArray = tags.split(/\s+/).filter(tag => tag.trim() !== "");

    const hasTooManyTags = tagArray.length > 5;
    const hasLongTags = tagArray.some((tag) => tag.length > 10);

    if (showError) {
      if (tagArray.length === 0) {
        onTagsError('Tags cannot be empty');
      } else if (hasTooManyTags) {
        onTagsError('Cannot have more than 5 tags');
      } else if (hasLongTags) {
        onTagsError('Each tag should be 10 characters or less');
      } else {
        onTagsError(''); // Clear any existing error message
      }
    }
  }, [tags, showError, onTagsError]);

  return null; 
}
