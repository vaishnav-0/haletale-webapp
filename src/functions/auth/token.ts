import jwtDecode, { JwtPayload } from "jwt-decode";
class Token {
    private type;
    constructor(type: "id" | "refresh") {
        this.type = type;
    }
    private getExpiry = (token: string): number => {

        let tokenDecoded = jwtDecode<JwtPayload>(token);
        let exp: number = tokenDecoded.exp as number;
        let expiry: number = new Date().valueOf() - new Date(exp * 1000).valueOf();

        ///consollleee
        console.log(expiry);
        return expiry;
    }

    isValid(): boolean {

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
        return localStorage.getItem(this.type);
    }

    getData = (): object | null => {
        let token = this.get() as string;
        if (token)
            return jwtDecode<JwtPayload>(token);
        else
            return null;
    }


    set = (token: string): void => {
        localStorage.setItem(this.type, token);
    }

    remove = (): void => {
        localStorage.removeItem(this.type);
    }

}
export default Token;