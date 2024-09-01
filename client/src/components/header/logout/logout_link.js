
import { Link } from "react-router-dom"
export default function Logoutbutton(){
    return(
        <div>
        <Link to='/logout'><button>logout</button></Link>
        </div>
    )
}