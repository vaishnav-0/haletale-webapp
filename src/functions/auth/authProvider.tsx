// const AuthProvider = {
// //     isAuthenticated: false,
// //     signin(callback: VoidFunction) {
// //       AuthProvider.isAuthenticated = true;
// //       setTimeout(callback, 100);
// //     },
// //     signout(callback: VoidFunction) {
// //       AuthProvider.isAuthenticated = false;
// //       setTimeout(callback, 100);
// //     }
// //   };

// //   export { AuthProvider };

import React from 'react';
import authContext from './authContext';




export function AuthProvider({ children }: { children: React.ReactNode }) {
    let [user, setUser] = React.useState<any>(null);


    const AuthContext = React.useContext(authContext);

    //     let signin = (newUser: string, callback: VoidFunction) => {
    //       return fakeAuthProvider.signin(() => {
    //         setUser(newUser);
    //         callback();
    //       });
    //     };

    //     let signout = (callback: VoidFunction) => {
    //       return fakeAuthProvider.signout(() => {
    //         setUser(null);
    //         callback();
    //       });
    //     };

    let value = {
        user,
        // signin, signout 
    };

    return <AuthContext.Provider value= { value } >{children}</AuthContext.Provider>;
}