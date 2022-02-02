import { createContext } from 'react';
import { AuthContextType } from './types';

const authContext = createContext<AuthContextType>(null!);

export default authContext;