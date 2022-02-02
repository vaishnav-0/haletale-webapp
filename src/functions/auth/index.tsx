import Token from "./token";
import OAuth2 from "./OAuth2";
import { useNavigate } from "react-router";
import { useAuth } from './useAuth';
import { authTypes } from "./types";



const token = new Token();

const navigate = useNavigate();
const auth = useAuth();

function signIn(authType: authTypes, data?: object): JSX.Element | void | Function {

    if (token.isValid()) {
        // set context
        auth.token = token.get();
        return navigate('/');
    }

    else {
        if (authType === authTypes.OAuth2Providers)
            return <OAuth2 provider={authType as unknown as string}></OAuth2>
        else

    }
    
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