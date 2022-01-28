import Token from "./token";
import OAuth2 from "./OAuth2";
import { useNavigate } from "react-router";
import { useAuth } from './useAuth';

enum OAuth2Providers { 'Google', 'FaceBook' };
enum LoginTypes { 'email_pass', 'otp' }

type authTypes = LoginTypes | OAuth2Providers;

const token = new Token();

const navigate = useNavigate();
const auth = useAuth();

function signIn(authType: authTypes): JSX.Element | void {

    if (token.isValid()) {
        // set context
        auth.token = token.get();
        return navigate('/');
    }
    else return <OAuth2 provider={authType as unknown as string}></OAuth2>
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