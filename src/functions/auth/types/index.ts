import { DotToken } from "typescript"

export type TSignUpObject = {
    email: string,
    phone?: string,
    password: string,
    name: string,
    date_of_birth?: string,
    gender?: string
}

export type TSignInObject = {
    email: string,
    password: string,
}


export type TSignInResponseObject = {

    access_token: string,
    id_token: string,
    refresh_token: string
}


export enum Roles { tenant = 'tenant', landlord = 'landlord' };


export interface AuthContextType {
    user: IUser | null,
}


export type authTypes = 'email_pass' | 'otp' | 'Google' | 'FaceBook'
export interface IUser {
    token: string | null
    tokenExpiry: Date
    role: Roles[]
    username: string
}
export type TSignSuccessCB = (user: IUser | null) => void
export type TSignErrorCB = (err: Error) => void
export type TOnAuthStateChange = (successCB: TSignSuccessCB, errCB?: TSignErrorCB) => () => void