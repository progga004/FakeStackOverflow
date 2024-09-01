
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUserData = localStorage.getItem('userData');
        return storedUserData ? JSON.parse(storedUserData) : null;
      });
      const [isAdmin, setIsAdmin] = useState(() => {
        const storedIsAdmin = localStorage.getItem('isAdmin');
        return storedIsAdmin !== null ? JSON.parse(storedIsAdmin) : false;
    });

  return (
    <UserContext.Provider value={{ user, setUser, isAdmin, setIsAdmin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
