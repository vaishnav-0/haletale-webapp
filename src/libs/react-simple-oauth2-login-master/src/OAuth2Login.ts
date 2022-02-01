import PopupWindow from './PopupWindow';
import { toQuery } from './utils';

const responseTypeLocationKeys = {
  code: 'search',
  token: 'hash',
};

const responseTypeDataKeys = {
  code: 'code',
  token: 'access_token',
};

class OAuth2Login {
  props: PropsType;
  popup?: PopupWindow;
  constructor(init: PropsType) {
    this.props = init;
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
    const payload = {
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
      response_type: responseType,
      ...extraParams,
      ...state ? { state } : {},
    };
    const search = toQuery(payload);
    const width = popupWidth;
    const height = popupHeight;
    const left = window.screenX + ((window.outerWidth - (width as number)) / 2);
    const top = window.screenY + ((window.outerHeight - (height as number)) / 2.5);
    const locationKey = responseTypeLocationKeys[responseType];
    const popup = PopupWindow.open(
      (Math.random() + 1).toString(36).substring(6),
      `${authorizationUrl}?${search}`,
      {
        height, width, top, left,
      },
      {
        locationKey,
        isCrossOrigin,
      },
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

  onSuccess(data:any) {
    const { responseType, onSuccess, isCrossOrigin } = this.props;
    const responseKey = responseTypeDataKeys[responseType];

    // Cross origin requests will already handle this, let's just return the data
    if (!isCrossOrigin && !data[responseKey]) {
      console.error('received data', data);
      return this.onFailure(new Error(`'${responseKey}' not found in received data`));
    }

    return onSuccess(data);
  }

  onFailure(error:any) {
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

export default OAuth2Login;
