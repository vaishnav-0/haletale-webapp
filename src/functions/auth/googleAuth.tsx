import OAuth2Login from 'react-simple-oauth2-login';
import googleLogo from '../assets/icons/google-logo.png';
import fbLogo from '../assets/icons/fb_logo_color.png';

export const OAuth2 = ({ provider }: { provider: string }): JSX.Element => {

    return (
        <OAuth2Login
            authorizationUrl="https://haletale-web1.auth.ca-central-1.amazoncognito.com/oauth2/authorize"
            responseType="token"
            clientId="7qn7vujd2vnafig3494ktacae1"
            redirectUri="http://localhost:3000/auth"
            scope="email openid phone"
            extraParams={{ identity_provider: provider }}
            onSuccess={(o: { [k: string]: any }) => console.log(o)}
            onFailure={(o: { [k: string]: any }) => console.log(o)}
            render={(p: { [k: string]: any }) => {
                return (<button type='button' onClick={p.onClick}>
                    <img src={googleLogo} />
                </button>);
            }}
        />
    )
}

