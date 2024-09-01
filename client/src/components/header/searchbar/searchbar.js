import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Logout from "../../welcome/logout";

export default function Searchbar({ onSearch, clearSearch }) {
  const [searchInput, setSearchInput] = useState('');
  const location = useLocation();

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      console.log('Enter key pressed, initiating search:', searchInput);
      onSearch(searchInput); // Trigger the search with the current input
    }
  };

  useEffect(() => {
    if (clearSearch) {
      setSearchInput('');
    }
  }, [clearSearch]);

  const queryParams = new URLSearchParams(location.search);
  const isGuest = queryParams.get('guest') === 'true';

  return (
    <>
      <div className="Searchbar">
        <input
          className="Searchinput"
          type="text"
          value={searchInput}
          onChange={handleSearchInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
        />
      </div>
      <Logout />
    </>
  );
}
