import OAuth2Login from '../../libs/react-simple-oauth2-login-master/src/OAuth2Login';

const OAuth2 = (provider: string, callback: Function) => {
    return new OAuth2Login({
        authorizationUrl: "https://haletale-web1.auth.ca-central-1.amazoncognito.com/oauth2/authorize",
        responseType: "token",
        clientId: "7qn7vujd2vnafig3494ktacae1",
        redirectUri: "http://localhost:3000/auth",
        scope: "email openid phone",
        extraParams: { identity_provider: provider },
        onSuccess: (o: { [k: string]: any }) => console.log(o),
        onFailure: (o: { [k: string]: any }) => console.log(o),
    })
}

export default OAuth2

