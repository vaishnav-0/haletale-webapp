import PopupWindow from './PopupWindow';
import { toQuery, toParams } from './utils';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64url';
import Utf8 from 'crypto-js/enc-utf8'
import cryptoRandomString from '../../../functions/crypto/randomStringGenerator'
import { onError } from '@apollo/client/link/error';
import { WordArray } from 'amazon-cognito-identity-js';
const responseTypeLocationKeys = {
  code: 'search',
  token: 'hash',
} as const;

const responseTypeDataKeys = {
  code: 'code',
  token: 'access_token',
};
class OAuth2Login {
  props: PropsType;
  popup?: PopupWindow;
  config: ConfigType;
  code_verifier: string | null;
  code_challenge: string | null;
  constructor(init: PropsType, config?: ConfigType) {
    this.props = init;
    this.config = config;
    ({
      scope: this.props.scope = '', state: this.props.state = '',
      popupWidth: this.props.popupWidth = 680,
      popupHeight: this.props.popupHeight = 680,
      isCrossOrigin: this.props.isCrossOrigin = false,
      extraParams: this.props.extraParams = {},
      onRequest: this.props.onRequest = () => { }
    } = init);
    this.login = this.login.bind(this);
    this.onRequest = this.onRequest.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
    this.code_verifier = null;
    this.code_challenge = null;
  }

  login() {
    const {
      authorizationUrl,
      clientId,
      scope,
      redirectUri,
      state,
      responseType,
      popupWidth,
      popupHeight,
      isCrossOrigin,
      extraParams,
    } = this.props;
    const payload: any = {
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
      response_type: responseType,
      ...extraParams,
      ...state ? { state } : {},
    };
    const width = popupWidth;
    const height = popupHeight;
    const left = window.screenX + ((window.outerWidth - (width as number)) / 2);
    const top = window.screenY + ((window.outerHeight - (height as number)) / 2.5);
    const locationKey = responseTypeLocationKeys[responseType];
    const otherOptions: any = {
      locationKey,
      isCrossOrigin,
    };
    if (responseType === 'code' && this.config) {
      this.code_verifier = cryptoRandomString({ length: 100, type: "url-safe" })
      this.code_challenge = Base64.stringify(sha256(this.code_verifier));
      payload.code_challenge_method = "S256";
      payload.code_challenge = this.code_challenge;
    }
    const search = toQuery(payload);

    const popup = PopupWindow.open(
      (Math.random() + 1).toString(36).substring(6),
      `${authorizationUrl}?${search}`,
      {
        height, width, top, left,
      },
      otherOptions
    );
    this.popup = popup;

    this.onRequest();
    popup
      .then(this.onSuccess)
      .catch(this.onFailure);
  }

  onRequest() {
    const { onRequest } = this.props;
    onRequest && onRequest();
  }

  onSuccess(data: any) {
    const { responseType, onSuccess, onFailure, isCrossOrigin, clientId, scope, redirectUri } = this.props;
    if (this.props.responseType === 'code' && this.config) {
      const code = data.code;
      fetch(this.config!.tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": 'application/x-www-form-urlencoded'
        },
        body: toQuery({
          grant_type: "authorization_code",
          client_id: clientId,
          scope: scope,
          redirect_uri: redirectUri,
          code: code,
          //https://aws.amazon.com/blogs/mobile/understanding-amazon-cognito-user-pool-oauth-2-0-grants/
          // code_verifier (optional, is required if a code_challenge was specified in the original request) – 
          // The *base64 URL-encoded* representation of the unhashed, random string that was used to generate the 
          // PKCE code_challenge in the original request.
          //conflict with https://datatracker.ietf.org/doc/html/rfc7636#section-4.5
          //So base64 URL-encoded code_verifier not needed as per aws blog
          code_verifier: this.code_verifier!,
        })
      }).then(res => {
        if (res.status !== 200)
          throw { code: "NewtworkError", message: "Network error" };
        res.json()
      }).then(d => {
        console.log(d)
        onSuccess(d)
      }).catch(e => onFailure(e));
    } else {
      const responseKey = responseTypeDataKeys[responseType];
      // Cross origin requests will already handle this, let's just return the data
      if (!isCrossOrigin && !data[responseKey]) {
        console.error('received data', data);
        return this.onFailure(new Error(`'${responseKey}' not found in received data`));
      }

      return onSuccess(data);

    }



  }


  onFailure(error: any) {
    const { onFailure } = this.props;
    onFailure(error);
  }

}

type PropsType = {
  authorizationUrl: string,
  clientId: string,
  redirectUri: string,
  responseType: 'code' | 'token',
  onSuccess: (data: any) => void,
  onFailure: (error: any) => void,
  popupWidth?: number,
  popupHeight?: number,
  isCrossOrigin?: boolean,
  onRequest?: () => void,
  scope?: string,
  state?: string,
  extraParams?: object,
};
type ConfigType = { pkce: boolean, tokenUrl: string } | undefined;

export default OAuth2Login;
