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


export enum Roles { tenant = 'tenant', landlord = 'landlord', user = 'user',  admin = 'admin' };


export interface AuthContextType {
    user: IUser | null,
}


export type authTypes = 'email_pass' | 'otp' | 'Google' | 'Facebook'
export interface IUser {
    token: string | null
    tokenExpiry: Date
    role: Roles[]
    user_id: string
    user_details?: {
        name: string,
        email?: string,
        phone?: string
    }
}
export type TSignSuccessCB = (user: IUser | null) => void
export type TSignErrorCB = (err: any) => void
export type TOnAuthStateChange = (successCB: TSignSuccessCB, errCB?: TSignErrorCB) => () => void