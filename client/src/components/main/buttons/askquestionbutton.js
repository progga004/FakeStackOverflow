import React from "react";

export default function Askquestion({ toggleShowForm }) {
    const handleClick = () => {
        toggleShowForm()
    }
    return (
        <div className="Askquestioncontainer">
            <button className="Askquestionbutton" onClick={handleClick}>Ask Question</button>
        </div>

    )
}