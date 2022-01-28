import jwtDecode, { JwtPayload } from "jwt-decode";

class Token {
    constructor() { }

    private getExpiry = (token: string): number => {

        let tokenDecoded = jwtDecode<JwtPayload>(token);
        let exp: number = tokenDecoded.exp as number;
        let expiry: number = new Date().valueOf() - new Date(exp * 1000).valueOf();

        ///consollleee
        console.log(expiry);
        return expiry;
    }

    isValid = (): boolean => {

        let token = this.get();
        if (token === null) {
            return false;
        }

        let expiry: number = this.getExpiry(token);
        if (expiry <= 0) {
            return true;
        }
        else {
            return false;
        }
    }


    get = (): string | null => {
        return localStorage.getItem('token');
    }

  
    set = (token: string): void => {
        localStorage.setItem('token', token);
    }

    remove = () : void =>{
        localStorage.removeItem('token');
    }

}


export default Token;