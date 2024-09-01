export default function Newestbutton({onSortChange}){
    return(
        <button className='Newestbutton' onClick={() => onSortChange("newest")}>Newest</button>
    )
}