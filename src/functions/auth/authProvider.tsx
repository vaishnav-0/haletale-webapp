import React from 'react';
import authContext from './authContext';
import auth from './index';
import { toast } from 'react-toastify';
import { setGlobalLoader } from '../../components/Loader';
import { useLazyQuery } from '@apollo/client';
import userQuery from '../../queries/user.query';
import cloneDeep from 'clone-deep';
import { IUser } from './types';
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<{ user: IUser | null } | null>(null);
  let [getUserData, { data: userData, loading: userDataloading }] = useLazyQuery(userQuery.GET_USER_DETAILS);
  React.useLayoutEffect(() => {
    if (user === null)
      setGlobalLoader(true, { backgroundColor: "white" })
    else
      setGlobalLoader(false)
  }, [user]);
  React.useEffect(() => {
    return auth.onAuthStateChange(
      (u) => {
        if (u)
          getUserData({ variables: { id: u?.user_id } });
        console.log(u)
        setUser({ user: u });
      },
      (err) => {
        console.log(err);
        err?.code === "NotAuthorizedException" && toast.error('Incorrect username or password.');
        err?.code === "NewtworkError" && toast.error('Network error. Please try again.');
      })
  }, []);
  React.useEffect(() => {
    if (userData?.user[0])
      setUser((u: any) => {
        const uC = cloneDeep(u)
        uC.user.user_details = userData.user[0];
        return uC;
      })
  }, [userData]);
  return <authContext.Provider value={user}>{children}</authContext.Provider>;

}