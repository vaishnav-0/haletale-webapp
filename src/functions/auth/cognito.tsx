import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
    ICognitoUserPoolData
} from 'amazon-cognito-identity-js';
import { TSignUpObject, TSignInObject } from './types';

const poolData: ICognitoUserPoolData = {
    UserPoolId: "ca-central-1_iO0qMcotb",
    ClientId: "7qn7vujd2vnafig3494ktacae1"
}

const userPool = new CognitoUserPool(poolData);


function cognitoSignUp(params: TSignUpObject, callback: (err: Error | null, data?: any) => void): void {

    let attributes: Array<CognitoUserAttribute> = [];
    let attributeEmail = new CognitoUserAttribute({
        Name: 'email',
        Value: params.email,
    });
    attributes.push(attributeEmail);

    if (params.name) {
        let attributePhoneNumber = new CognitoUserAttribute({
            Name: 'name',
            Value: params.name,
        });
        attributes.push(attributePhoneNumber);
    }

    if (params.phone) {
        let attributePhoneNumber = new CognitoUserAttribute({
            Name: 'phone_number',
            Value: params.phone,
        });
        attributes.push(attributePhoneNumber);
    }
    userPool.signUp(params.email, params.password, attributes, [], (err, result) => {
        if (err) {
            console.log(err.message || JSON.stringify(err));
            callback(err);
            return;
        }
        callback(null, result)
        console.log(result)
        let cognitoUser = result?.user;
        console.log('user name is ' + cognitoUser?.getUsername() + cognitoUser);
        //callback

    });

    return;
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


export { cognitoSignin, cognitoSignUp };