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



function cognitoSignUp(params: TSignUpObject): void {
    let attributes: Array<CognitoUserAttribute> = [];
    let attributeEmail = new CognitoUserAttribute({
        Name: 'email',
        Value: params.email,
    });
    attributes.push(attributeEmail);


    if (params.phone) {
        let attributePhoneNumber = new CognitoUserAttribute({
            Name: 'phone_number',
            Value: params.phone,
        });
        attributes.push(attributePhoneNumber);
    }


    // email is used as username too
    userPool.signUp(params.email, params.password, attributes, [], (err, result) => {
        if (err) {
            alert(err.message || JSON.stringify(err));

            return;
        }
        let cognitoUser = result!.user;
        console.log('user name is ' + cognitoUser.getUsername() + cognitoUser);
        //callback

    });

    return;
}


function cognitoSignin(params: TSignInObject , callback : Function): void {

    let authenticationDetails = new AuthenticationDetails({
        Username: params.email,
        Password: params.password,
    });

    let userData = {
        Username: params.email,
        Pool: userPool,
    };

    let cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result: any) {
            var accessToken = result.getAccessToken().getJwtToken();
            console.log(result)
            callback(result);
        },

        onFailure: function (err: any) {
            console.log(err)
            callback(err)
        },
    });
}


export { cognitoSignin, cognitoSignUp };