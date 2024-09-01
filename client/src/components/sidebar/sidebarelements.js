
// // // import React from 'react';

// // // /**
// // //  * @function this will render the sidebar elements for navigation: Questions and Tags
// // //  * @params none
// // //  * @returns A sidebar used for the client to redirect page
// // //  */


import React, { useState } from 'react';

export default function Sidebarelements({ onDisplayChange, onHideForm,onSortChange, isGuest}) {
  const [activeLink, setActiveLink] = useState('questions'); // Default active link

  const handleClick = (link) => {
    setActiveLink(link); // Set the clicked link as active
    onHideForm();
    onDisplayChange(link, link === 'questions'); 
    onSortChange('newest');
  };
  

  return (
    <div className='Sidebar'>
      <div className='Questions'>
        <button
          className={activeLink === 'questions' ? 'link active' : 'link'}
          onClick={() => handleClick('questions')}
        >
          Questions
        </button>
      </div>
      <div className='Tags'>
        <button
          className={activeLink === 'tags' ? 'link active' : 'link'}
          onClick={() => handleClick('tags')}
        >
          Tags
        </button>
      </div>
      <div className='User'>
        {!isGuest && 
        <button
          className={activeLink === 'user' ? 'link active' : 'link'}
          onClick={() => handleClick('user')}
        >
          User
        </button>
        }
      </div>
    </div>
  );
}

