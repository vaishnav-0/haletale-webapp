export type TSignUpObject = {
    email: string,
    phone?: string,
    password: string
}

export type TSignInObject = {
    email: string,
    password: string,
}


export type TSignUpResponseObject = {
    idToken: string,
    role: Array<string>,
    userName: string,
    expiry: number
}


export enum Roles { tenant = 'tenant', landlord = 'landlord' };


export interface AuthContextType {
    token?: string | null
    tokenExpiry?: Date
    provider?: string
    role?: Roles
    user?: string
    signin: (user: string, callback: VoidFunction) => void;
    signout: (callback: VoidFunction) => void;
}


export type authTypes = 'email_pass' | 'otp' | 'Google' | 'FaceBook'
