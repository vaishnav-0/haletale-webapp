import jwtDecode, { JwtPayload } from "jwt-decode";

/**
 * 
 * @param token 
 * @returns expiry time of token
 */
const getExpiry = (token: string): number => {

    let tokenDecoded = jwtDecode<JwtPayload>(token);
    let exp: number = tokenDecoded.exp as number;
    let expiry: number = new Date().valueOf() - new Date(exp * 1000).valueOf();
    console.log(expiry)
    return expiry;
}

/**
 * 
 * @returns true if token is valid
 */

const isTokenValid = (): boolean => {

    let token = getToken();
    if (token === null) {
        return false;
    }

    let expiry: number = getExpiry(token)
    if (expiry <= 0) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * 
 * @returns the token from local storage
 */
const getToken = (): string | null => {
    return localStorage.getItem('token');
}

/**
 * 
 * @param token 
 * 
 */
const setToken = (token: string): void => {
    localStorage.setItem('token', token);
}

export { isTokenValid, getExpiry }