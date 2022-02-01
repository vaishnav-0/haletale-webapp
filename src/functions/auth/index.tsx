import Token from "./token";
import OAuth2 from "./OAuth2";
import { useNavigate } from "react-router";
import { useAuth } from './useAuth';

export type OAuth2ProvidersType = 'Google' | 'Facebook' | 'email_pass' | 'otp'


const token = new Token();

//const navigate = useNavigate();
//const auth = useAuth();

function signIn(authType: OAuth2ProvidersType): JSX.Element | void {

    if (token.isValid()) {
        // set context
       // auth.token = token.get();
        //return navigate('/');
    }
    else
        OAuth2({ provider: authType }).login();
}




function signInCallback(response: object): void {


    // if(response.status === "success")
    // token.set(bearerToken);
    // authcontext.

}

function signOut(): void {
    token.remove();
}



export { signIn, signOut, signInCallback };