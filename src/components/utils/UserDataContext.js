import React, { createContext, useState, useContext } from 'react';

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [isUserDataReady, setIsUserDataReady] = useState(false);

  return (
    <UserDataContext.Provider value={{ isUserDataReady, setIsUserDataReady }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);
