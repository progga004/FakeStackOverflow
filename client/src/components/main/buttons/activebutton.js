export default function Activebutton({onSortChange}){
    return(
        <button className='Activebutton' onClick={() => onSortChange("active")}>Active</button>
    )
}