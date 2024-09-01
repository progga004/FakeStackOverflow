import { useEffect, useImperativeHandle, forwardRef, useCallback } from "react";

function SummaryError({ summary, showError, onSummaryError }, ref) {
  const validateSummary = useCallback(() => {
    let isValid = true;

    if (summary.trim() === "") {
      onSummaryError("Summary cannot be blank");
      isValid = false;
    } else if (summary.length > 140) {
      onSummaryError("Summary cannot exceed 140 characters");
      isValid = false;
    } else {
      onSummaryError("");
    }

    return isValid;
  }, [summary, onSummaryError]);

  useEffect(() => {
    if (showError) {
      validateSummary();
    }
  }, [summary, showError, onSummaryError, validateSummary]);

  useImperativeHandle(ref, () => ({
    forceValidate: () => validateSummary(),
  }));

  return null;
}

export default forwardRef(SummaryError);
