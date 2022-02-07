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
    id_token: string,
    role: Array<string>,
    userName: string,
    expiry: number
}


export enum Roles { tenant = 'tenant', landlord = 'landlord' };


export interface AuthContextType {
    user?: IUser
}


export type authTypes = 'email_pass' | 'otp' | 'Google' | 'FaceBook'
export interface IUser {
    token: string | null
    tokenExpiry: Date
    role: Roles
    username: string
}
export type TSignSuccessCB = (user: IUser | null) => void
export type TSignErrorCB = (err: Error) => void
export type TOnAuthStateChange = (successCB: TSignSuccessCB, errCB?: TSignErrorCB) => () => void