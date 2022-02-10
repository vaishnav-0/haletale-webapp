import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
    ICognitoUserPoolData
} from 'amazon-cognito-identity-js';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { TSignUpObject, TSignInObject } from './types';

const poolData: ICognitoUserPoolData = {
    UserPoolId: "ca-central-1_iO0qMcotb",
    ClientId: "7qn7vujd2vnafig3494ktacae1"
}

const userPool = new CognitoUserPool(poolData);

const provider = new CognitoIdentityProvider({ region: 'ca-central-1' });

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
    // let attributes: Array<CognitoUserAttribute> = [];
    // let attributeEmail = new CognitoUserAttribute({
    //     Name: 'email',
    //     Value: params.email,
    // });
    // attributes.push(attributeEmail);


    // if (params.phone) {
    //     let attributePhoneNumber = new CognitoUserAttribute({
    //         Name: 'phone_number',
    //         Value: params.phone,
    //     });
    //     attributes.push(attributePhoneNumber);
    // }
    // email is used as username too
    // userPool.signUp(params.email, params.password, attributes, [], (err, result) => {
    //     if (err) {
    //         alert(err.message || JSON.stringify(err));

    //         return;
    //     }
    //     let cognitoUser = result!.user;
    //     console.log('user name is ' + cognitoUser.getUsername() + cognitoUser);
    //     //callback

    // });

    return;
}


function cognitoSignin(params: TSignInObject, callback: Function): void {

    let authenticationDetails = {
        USERNAME: params.email,
        PASSWORD: params.password,
    };

    let userData = {
        Username: params.email,
        Pool: userPool,
    };

    provider.initiateAuth({ AuthFlow: "USER_PASSWORD_AUTH", AuthParameters: authenticationDetails, ClientId: poolData.ClientId });
    // let cognitoUser = new CognitoUser(userData);
    // cognitoUser.authenticateUser(authenticationDetails, {
    //     onSuccess: function (result: any) {
    //         var accessToken = result.getAccessToken().getJwtToken();
    //         console.log(result)
    //         callback(null, result);
    //     },

    //     onFailure: function (err: Error) {
    //         console.log(err)
    //         callback(err);
    //     },
    // });
}


export { cognitoSignin, cognitoSignUp };