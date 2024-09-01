export default function Unansweredbutton({onSortChange}){
    return(
        <button className='Unansweredbutton' onClick={() => onSortChange("unanswered")}>Unanswered</button>
    )
}