import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <>
      <div className="Welcome_title">
        <h1>Fake Stack Overflow</h1>
      </div>
      <div className="Welcome_options">
        <div>
          <div className="Welcome_nav">
            <div className="Welcome_choice">
              <div>
                <h2>For Existing Users</h2>
              </div>
              <div>
                <Link to="/login">
                  <button>Login</button>
                </Link>
              </div>
            </div>

            <div className="Welcome_choice">
              <div>
                <h2>For New Users</h2>
              </div>
              <div>
                <Link to="/signup">
                  <button>Signup</button>
                </Link>
              </div>
            </div>

            <div className="Welcome_choice">
              <h2>Continue as a guest</h2>
              <div>
                <Link to="/fakeStackOverflow?guest=true">
                  <button>Guest</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}