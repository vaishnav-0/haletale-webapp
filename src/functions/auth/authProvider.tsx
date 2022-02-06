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
import { useAuth } from './useAuth';
import authContext from './authContext';



// const fakeAuthProvider = {
//     isAuthenticated: false,
//     signin(callback: VoidFunction) {
//       fakeAuthProvider.isAuthenticated = true;
//       setTimeout(callback, 100); // fake async
//     },
//     signout(callback: VoidFunction) {
//       fakeAuthProvider.isAuthenticated = false;
//       setTimeout(callback, 100);
//     }
//   };

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    let [user, setUser] = React.useState<any>(null);

    const AuthContext = useAuth();

        let signin = (newUser: string, callback: VoidFunction) => {
          return fakeAuthProvider.signin(() => {
            setUser(newUser);
            callback();
          });
        };

        let signout = (callback: VoidFunction) => {
          return fakeAuthProvider.signout(() => {
            setUser(null);
            callback();
          });
        };

    let value = {
        user,
        signin, signout 
    };

    return <authContext.Provider value={value}>{children}</authContext.Provider>;

}