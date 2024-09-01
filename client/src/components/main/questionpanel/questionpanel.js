import Allquestions from "./allquestions"
import Askquestion from "../buttons/askquestionbutton"
import React from "react";
export default function Questionpanel({ toggleShowForm,isGuest }) {
    return (
        <div className="Questionpanel">
            <Allquestions />
            {!isGuest && <Askquestion toggleShowForm={toggleShowForm} />}
        </div>
    )
}