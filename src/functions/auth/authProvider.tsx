import React from 'react';
import authContext from './authContext';
import auth from './index';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<any>(null);
  React.useEffect(() => {
    return auth.onAuthStateChange(
      (u) => {
        console.log(u)
        setUser({ user: u });
      })
  }, []);
  console.log(user);
  return <authContext.Provider value={user}>{children}</authContext.Provider>;

}