import React from 'react';
import UserProvider from './src/contexts/User/UserProvider';
import ObserverProvider from './src/contexts/Observer/ObserverProvider';

// Named export required for useContext
/* eslint-disable import/prefer-default-export */
export const wrapRootElement = ({ element }) => {
  return (
    <ObserverProvider>
      <UserProvider>{element}</UserProvider>;
    </ObserverProvider>
  );
};
