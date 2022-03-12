
import React from 'react';
import { createContext } from 'react';
import { AuthContextType, IUser } from './types';

const userContext = createContext<IUser | null>(null);
const useUserContext = () => React.useContext(userContext);
export { userContext as default, useUserContext };