export type TSignUpObject = {
    email: string,
    phone?: string,
    password: string
}

export type TSignInObject = {
    email: string,
    password: string,
}


enum OAuth2Providers { 'Google' , 'FaceBook' };
enum LoginTypes { 'email_pass', 'otp' }

export enum authTypes { LoginTypes, OAuth2Providers };