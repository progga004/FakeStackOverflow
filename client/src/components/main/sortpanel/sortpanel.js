import React from "react";
import Searchresults from "./searchresults";
import Mainbuttons from "./mainbuttons";
import axios from "axios";
// import questions from "../../../../../server/models/questions";
axios.defaults.baseURL = "http://localhost:8000"; // Update with your server URL

export default function Sortpanel({
  onSortChange,
  totalQuestions,
}) {
  return (
    <div className="Sortpanel">
      <Searchresults totalQuestions={totalQuestions} />
      <Mainbuttons onSortChange={onSortChange} />
    </div>
  );
}
