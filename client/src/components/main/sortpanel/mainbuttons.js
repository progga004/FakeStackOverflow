import React from "react"
import Newestbutton from "../buttons/newestbutton"
import Activebutton from "../buttons/activebutton"
import Unansweredbutton from "../buttons/unansweredbutton"


export default function Mainbuttons({onSortChange}){
    return(
        <div className="Mainbuttons">
                    <div className="Buttoncontainer">
                        <div className="Box">
                            <Newestbutton onSortChange={onSortChange}/>
                        </div>
                        <div className="Box">
                            <Activebutton onSortChange={onSortChange} />
                        </div>
                        <div className="Box">
                            <Unansweredbutton onSortChange={onSortChange} />
                            
                        </div>
                    </div>
                </div>
    )
}