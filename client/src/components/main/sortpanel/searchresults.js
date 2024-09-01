export default function Searchresults({totalQuestions}){
    return(
        <div className="Results">
        <h3>{totalQuestions}  {totalQuestions <=1 ? 'question' : 'questions'}</h3>
    </div>
    )
}
