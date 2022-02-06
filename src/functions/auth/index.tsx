import Token from "./token";
import OAuth2 from "./OAuth2";
import { useNavigate } from "react-router";
import { useAuth } from './useAuth';
import { cognitoSignUp, cognitoSignin, } from "./cognito";
import { TSignUpResponseObject, TSignInObject, authTypes, TSignUpObject } from './types';
import OAuth2Login from '../../libs/react-simple-oauth2-login-master/src/OAuth2Login';


const token = new Token();

const navigate = useNavigate();
const authContext = useAuth();



function signInCallback(err: Error | null, data?: TSignUpResponseObject): void {
    if (!err) {
        token.set(data!.idToken);
    }
    else {
        console.log(err)
    }
}

function auth(): void {
    if (token.isValid()) {
        authContext.token = token.get();
        return navigate('/');
    }
}

auth.prototype.emailPasswordSignIn = function (data: TSignInObject) {
    return cognitoSignin(data, signInCallback);
}

auth.prototype.oauth = function (provider: authTypes): OAuth2Login {
    return OAuth2(provider, signInCallback);
}

auth.prototype.emailPasswordSignUp = function (data: TSignUpObject) {
    return cognitoSignUp(data);
}

auth.prototype.signOut = function (): void {
    token.remove();

}

export default auth;