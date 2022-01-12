import { createContext } from 'react';

export enum Roles { 'tenant', 'landlord' };


type AuthContextType = {
    token: string,
    userName: string,
    tokenExpiry: number,
    provider: string,
    role: Roles
};

const authContext  = createContext<AuthContextType>(null!);

export default authContext;