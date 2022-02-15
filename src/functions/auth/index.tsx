import Token from "./token";
import OAuth2 from "./OAuth2";
import { cognitoSignUp, cognitoSignin, refreshSession as cognitoRefreshSession } from "./cognito";
import {
    TSignInResponseObject,
    TSignInObject,
    authTypes,
    TSignUpObject,
    IUser,
    TOnAuthStateChange,
    TSignSuccessCB,
    TSignErrorCB
} from './types';

const idToken = new Token("id");
const refreshToken = new Token("refresh");
function toUser(token: Token) {
    const data: any = token.getData();
    return data && {
        token: token.get(),
        role: JSON.parse(data["https://hasura.io/jwt/claims"])["x-hasura-allowed-roles"],
        user_id: JSON.parse(data["https://hasura.io/jwt/claims"])["x-hasura-user-id"]

    }
}
class Auth {
    private signObservers: TSignSuccessCB[];
    private signErrorObservers: TSignErrorCB[];
    private _user: IUser | null;
    private _initialized: boolean;
    constructor() {
        this.signObservers = [];
        this.signErrorObservers = [];
        this.initAuth();
        this.signInCallback = this.signInCallback.bind(this)
        this.signInCallback = this.signInCallback.bind(this)
    }
    set user(u) { }
    get user() {
        return this._user;
    }

    private initAuth() {
        this.refreshSession(() => this._initialized = true)
    }
    refreshSession(cb?: (err?: any) => void) {
        if (refreshToken.get())
            this._refreshSession().then((res: any) => {
                const authResult = res.AuthenticationResult;
                authResult?.id_token && idToken.set(authResult.id_token);
                console.log(res);
                this.setUserFromIdToken();
                cb && cb();
            }).catch(err => {
                this.signErrorObserverNotify(err);
                this.setUser(null);
                cb && cb(err);
            });
        else {
            this.setUser(null);
            cb && cb(new Error("No refresh token found"));
        }
    }
    private removeTokens() {
        refreshToken.remove();
        idToken.remove();
    }
    private setUserFromIdToken() {
        this.setUser(toUser(idToken));
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
    signInCallback(err: Error | null, data?: TSignInResponseObject): void {
        if (!err) {
            console.log(data);
            data?.id_token && idToken.set(data.id_token);
            data?.refresh_token && refreshToken.set(data.refresh_token);
            this.setUserFromIdToken();
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
        if (this._initialized)
            successCB(this.user);
        signErrorCB && this.signErrorObservers.push(signErrorCB);
        return () => {
            this.signErrorObservers.splice(this.signErrorObservers.length - 1, 1)
            this.signObservers.splice(this.signObservers.length - 1, 1)
        }
    }
    emailPasswordSignIn(data: TSignInObject, callback?: Function) {
        return cognitoSignin(data, callback ? (err: any, result: any) => { this.signInCallback(err, result); callback(err, result); } : this.signInCallback);
    }

    oauth(provider: authTypes) {
        OAuth2(provider, this.signInCallback).login();
    }

    emailPasswordSignUp(data: TSignUpObject) {
        cognitoSignUp(data, this.signUpCallback);
    }
    private _refreshSession() {
        return new Promise((res, rej) => {
            const RT = refreshToken.get();
            if (RT)
                cognitoRefreshSession(RT,
                    (err: any, data: any) => {
                        if (err)
                            rej(err);
                        else {
                            res(data);
                        }
                    })
            else
                rej(new Error("No refresh token found"));
        })

    }
    signOut() {
        idToken.remove();
        this.setUserFromIdToken();
    }

}


export default new Auth();