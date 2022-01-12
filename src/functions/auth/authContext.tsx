import { createContext } from 'react';

export enum Roles { 'tenant', 'landlord' };


export interface AuthContextType {
    token?: string
    userName?: string
    tokenExpiry?: number
    //provider?: string
    role?: Roles
    signin: (user: string, callback: VoidFunction) => void;
    signout: (callback: VoidFunction) => void;
};

const authContext  = createContext<AuthContextType>(null!);

export default authContext;