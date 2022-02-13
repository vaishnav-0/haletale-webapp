import OAuth2Login from '../../libs/react-simple-oauth2-login-master/src/OAuth2Login';

const OAuth2 = (provider: string, callback: Function) => {
    return new OAuth2Login(
        {
            authorizationUrl: "https://haletale-web1.auth.ca-central-1.amazoncognito.com/oauth2/authorize",
            responseType: "code",
            clientId: "2msia8lds7enqe1cqutubt1l4s",
            redirectUri: "http://localhost:3000/auth",
            scope: "email openid phone profile",
            extraParams: { identity_provider: provider },
            onSuccess: (o: { [k: string]: any }) => callback(null, o),
            onFailure: (o: { [k: string]: any }) => callback(o),
        },
        {
            pkce: true,
            tokenUrl: "https://haletale-web1.auth.ca-central-1.amazoncognito.com/oauth2/token"
        }
    )
}

export default OAuth2

