import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
    ICognitoUserPoolData
} from 'amazon-cognito-identity-js';
import { TSignUpObject, TSignInObject } from './types';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

const provider = new CognitoIdentityProvider({ region: 'ca-central-1' });

const poolData: ICognitoUserPoolData = {
    UserPoolId: "ca-central-1_iO0qMcotb",
    ClientId: "2msia8lds7enqe1cqutubt1l4s"
}

const userPool = new CognitoUserPool(poolData);


function cognitoSignUp(params: TSignUpObject, callback: (err: Error | null, data?: any) => void): void {

    const { password, ...attributesObj } = params;
    const attributes = Object.entries(attributesObj).map(([k, v]) => Object.assign({}, { Name: k, Value: v }))
    console.log(attributes);
    provider.signUp({ ClientId: poolData.ClientId, Username: params.email, Password: params.password, UserAttributes: attributes },
        (err: any, data: any) => {
            if (err) {
                console.log(err);
                callback(err);
            }
            else {
                callback(null, data)
            }
        }
    );
}


function cognitoSignin(params: TSignInObject, callback: Function): void {
    let authenticationData = {
        Username: params.email,
        Password: params.password,
    };
    let authenticationDetails = new AuthenticationDetails(
        authenticationData
    );
    let userPool = new CognitoUserPool(poolData);
    let userData = {
        Username: params.email,
        Pool: userPool,
    };
    let cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result: any) {
            let accessToken = result.getAccessToken().getJwtToken();
            console.log(result)
            callback(null, {
                access_token: result.getAccessToken().getJwtToken(),
                id_token: result.getIdToken().getJwtToken(),
                refresh_token: result.getRefreshToken().getToken(),
            });
        },

        onFailure: function (err: Error) {
            console.log(err)
            callback(err);
        },
    });
}

function refreshSession(Rtoken: string, callback: Function) {
    if (typeof Rtoken !== 'string')
        throw new Error('Token must be a string')
    provider.initiateAuth({ AuthFlow: "REFRESH_TOKEN_AUTH", AuthParameters: { REFRESH_TOKEN: Rtoken }, ClientId: poolData.ClientId },
        (err: any, data: any) => {
            if (err) {
                console.log(err);
                callback(err);
            }
            else {
                callback(null, data)
            }
        });

}
export function revokeToken(token: string, callback: Function) {
    if (!token)
        throw new Error("token must be a string")
    provider.revokeToken({ ClientId: poolData.ClientId, Token: token },
        (err: any, data: any) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, data)
            }
        });
}
export { cognitoSignin, cognitoSignUp, refreshSession };