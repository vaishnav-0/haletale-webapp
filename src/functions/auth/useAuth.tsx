import React from 'react';
import authContext from "./authContext";


import { AuthContextType } from './types';
// useAuth hook
// returns authContext
// explicit type casting to React.Context<CT> to get Consumer Provider Types 

export const useAuth = () => React.useContext(authContext);
// as unknown as React.Context<AuthContextType>;