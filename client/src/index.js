
// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import FakeStackOverflow from './components/fakestackoverflow.js';
// /**
//  * @returns this is our root render
//  */
// ReactDOM.render(
//   <FakeStackOverflow />,
//   document.getElementById('root')
// );


import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import FakeStackOverflow from './components/fakestackoverflow.js';
import Welcome from './components/welcome/welcome.js';
import Login from './components/welcome/login.js';
import Signup from './components/welcome/signup.js';
import Logout from './components/logout/logout.js';
import Userprofilepage from './components/user/userprofilepage.js';
import { UserProvider } from './usercontext.js';
/**
 * @returns this is our root render
 */
// ReactDOM.render(
//   <Router>
//     <Routes>
//       <Route path="/" element={<Welcome />} />
//       <Route path="/protected" element={<Login />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/logout" element={<Logout />} />
//       <Route path="/fakestackoverflow" element={<FakeStackOverflow />} />
//     </Routes>
//   </Router>,
//   document.getElementById('root')
// );
ReactDOM.render(
  <UserProvider> {/* Wrap everything with UserProvider */}
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/protected" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/fakestackoverflow" element={<FakeStackOverflow />} />
        <Route path="/userprofile/:userId" element={<Userprofilepage />} />
      </Routes>
    </Router>
  </UserProvider>,
  document.getElementById('root')
);
