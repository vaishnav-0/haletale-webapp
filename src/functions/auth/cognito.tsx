import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
    ICognitoUserPoolData
} from 'amazon-cognito-identity-js';
import { TSignUpObject, TSignInObject } from './types';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

const poolData: ICognitoUserPoolData = {
    UserPoolId: "ca-central-1_iO0qMcotb",
    ClientId: "2msia8lds7enqe1cqutubt1l4s"
}
const provider = new CognitoIdentityProvider({ region: 'ca-central-1' });
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
function resendConfirmationCode(username: string, callback: Function) {
    provider.resendConfirmationCode({ ClientId: poolData.ClientId, Username: username },
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
function revokeToken(token: string, callback: Function) {
    if (!token)
        throw new Error("token must be a string")
    fetch("https://cognito-idp.ca-central-1.amazonaws.com", {
        method: "POST",
        body: JSON.stringify({ ClientId: poolData.ClientId, Token: token, }),
        headers: {
            "x-amz-target": "AWSCognitoIdentityProviderService.RevokeToken",
            "content-type": "application/x-amz-json-1.1"
        }
    }).then(d => {
        if (d.status === 200) return d.json()
        else
            throw new Error(JSON.stringify(d));
    }).then((res) => {
        callback(null, res);
        console.log(res);
    }).catch(err => {
        callback(err)
    })

}



function intitiateForgotPassword(username: string, callback: Function) {

    let cognitoUser = new CognitoUser({
        Username: username,
        Pool: new CognitoUserPool(poolData),
    });

    cognitoUser.forgotPassword({
        onSuccess: function (result) {
            console.log(result);
            callback(null, result);
        },
        onFailure: function (err) {
            console.log(err);
            callback(err);
        }
    });

}


function confirmPassword(username: string, verificationCode: string, newPassword: string, callback: Function) {

    let cognitoUser = new CognitoUser({
        Username: username,
        Pool: new CognitoUserPool(poolData),
    });

    cognitoUser.confirmPassword(verificationCode, newPassword, {
        onFailure(err) {
            console.log(err);
            callback(err);
        },
        onSuccess(res) {
            callback(null, res);
            console.log(res);
        }
    })

}

function changePassword(username: string, oldPassword: string, newPassword: string, callback: Function) {

    let cognitoUser = new CognitoUser({
        Username: username,
        Pool: new CognitoUserPool(poolData)
    });

    cognitoUser.changePassword(oldPassword, newPassword, function (err, result) {
        if (err) {
            console.log(err);
            callback(null, err)
            return;
        }
        console.log(result);
        callback(null, result);
    });
}
export { cognitoSignin, cognitoSignUp, refreshSession, revokeToken, resendConfirmationCode, intitiateForgotPassword, changePassword, confirmPassword };