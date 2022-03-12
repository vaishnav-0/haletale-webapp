import { createContext } from 'react';
import { AuthContextType } from './types';

const authContext = createContext<AuthContextType | null>(null);

export default authContext;