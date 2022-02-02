import Token from "./token";
import OAuth2 from "./OAuth2";
import { useNavigate } from "react-router";
import { useAuth } from './useAuth';
import { cognitoSignUp, cognitoSignin } from "./cognito";
import { TSignInObject } from './types';

enum OAuth2Providers {
    google = "Google",
    facebook = "FaceBook"
};
enum LoginTypes {
    email = 'email_pass',
    otp = 'otp'
}

<<<<<<< HEAD
export type authTypes = (typeof OAuth2Providers) & (typeof LoginTypes);
=======
export type OAuth2ProvidersType = 'Google' | 'Facebook' | 'email_pass' | 'otp'
>>>>>>> 9b041425749744d112a1e2cf129f1eacc4712675


const token = new Token();

//const navigate = useNavigate();
//const auth = useAuth();

<<<<<<< HEAD
function signIn(authType: authTypes, data?: TSignInObject): JSX.Element | void | Function {
=======
function signIn(authType: OAuth2ProvidersType): JSX.Element | void {
>>>>>>> 9b041425749744d112a1e2cf129f1eacc4712675

    if (token.isValid()) {
        // set context
       // auth.token = token.get();
        //return navigate('/');
    }
<<<<<<< HEAD

    else {
        if (authType === OAuth2Providers)
            return <OAuth2 provider={authType as unknown as string}></OAuth2>
        else {
            return cognitoSignin(data!, signInCallback)
        }
    }
=======
    else
        OAuth2({ provider: authType }).login();
>>>>>>> 9b041425749744d112a1e2cf129f1eacc4712675
}




function signInCallback(response: any): void {


    if (response.status === "success") {
        token.set(response.idToken);
        let data = token.getData();
    }

    else {
        console.log(response.error)
    }

}

function signOut(): void {
    token.remove();
}



export { signIn, signOut };