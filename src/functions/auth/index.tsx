import Token from "./token";
import OAuth2 from "./OAuth2";
import { cognitoSignUp, cognitoSignin, } from "./cognito";
import {
    TSignUpResponseObject,
    TSignInObject,
    authTypes,
    TSignUpObject,
    IUser,
    TOnAuthStateChange,
    TSignSuccessCB,
    TSignErrorCB
} from './types';

const token = new Token();
function toUser(token: Token) {
    const data: any = token.getData();
    return data && {
        token: token.get(),
        role: JSON.parse(data["https://hasura.io/jwt/claims"])["x-hasura-allowed-roles"],
        username: JSON.parse(data["https://hasura.io/jwt/claims"])["x-hasura-user-id"]

    }
}
class Auth {
    private signObservers: TSignSuccessCB[];
    private signErrorObservers: TSignErrorCB[];
    private _user: IUser | null;
    constructor() {
        this.signObservers = [];
        this.signErrorObservers = [];
        this.setUserFromToken();
    }
    set user(u) { }
    get user() {
        return this._user;
    }
    private setUserFromToken() {
        this.setUser(token.isValid() ? toUser(token) : null);
    }
    private setUser(u: IUser | null) {
        this._user = u;
        this.signObserverNotify(u);
    }
    private signObserverNotify(u: IUser | null) {
        this.signObservers.forEach(fn => fn(u));
    }
    private signErrorObserverNotify(err: Error) {
        this.signErrorObservers.forEach(fn => fn(err));
    }
    signInCallback(err: Error | null, data?: TSignUpResponseObject): void {
        if (!err) {
            console.log(data);
            token.set(data!.id_token);
            this.setUserFromToken();
        }
        else {
            this.signErrorObserverNotify(err);
            console.log(err)
        }
    }
    signUpCallback(err: Error | null, data?: any): void {
        if (!err) {
            console.log(data);
        }
        else {
            console.log(err)
        }
    }
    onAuthStateChange: TOnAuthStateChange = (successCB, signErrorCB) => {
        this.signObservers.push(successCB);
        successCB(this.user);
        signErrorCB && this.signErrorObservers.push(signErrorCB);
        return () => {
            this.signErrorObservers.splice(this.signErrorObservers.length - 1, 1)
            this.signObservers.splice(this.signObservers.length - 1, 1)
        }
    }
    emailPasswordSignIn(data: TSignInObject) {
        return cognitoSignin(data, this.signInCallback.bind(this));
    }

    oauth(provider: authTypes) {
        OAuth2(provider, this.signInCallback.bind(this)).login();
    }

    emailPasswordSignUp(data: TSignUpObject) {
        return cognitoSignUp(data, this.signUpCallback);
    }

    signOut = function (): void {
        token.remove();

    }

}


export default new Auth();