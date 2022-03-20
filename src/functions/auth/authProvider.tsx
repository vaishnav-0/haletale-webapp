import React from 'react';
import authContext from './authContext';
import auth from './index';
import { toast } from 'react-toastify';
import { setGlobalLoader } from '../../components/Loader';
import { useApolloClient, useLazyQuery } from '@apollo/client';
import userQuery from '../../queries/user.query';
import cloneDeep from 'clone-deep';
import { IUser } from './types';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<{ user: IUser | null } | null>(null);
  const [getUserData, { data: userData, loading: userDataloading, refetch: userDataRefetch, called }] = useLazyQuery(userQuery.GET_USER_DETAILS, {
    fetchPolicy: "no-cache"
  });
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
          if (!called)
            getUserData({ variables: { id: u.user_id } });
          else
            userDataRefetch({ id: u.user_id });
        if (u && (userData?.user[0]?.id === u?.user_id)) { //apollo client fetch policy doesn't work as expected
          const { id, ...uData } = userData.user[0];
          setUser({ user: { ...u!, user_details: uData } });
        }
        else {
          setUser({ user: u });
        }
      },
      (err) => {
        console.log(err.code);
        err?.code === "NotAuthorizedException" && toast.error('Incorrect username or password.');
        err?.code === "UserLambdaValidationException" && toast.error('User is disabled.');
        err?.code === "NewtworkError" && toast.error('Network error. Please try again.');
      })
  }, [called, userData]);
  React.useEffect(() => {
    if (userData?.user[0])
      setUser((u) => {
        const uC = cloneDeep(u)
        uC!.user!.user_details = userData.user[0];
        return uC;
      })
  }, [userData, userDataloading]);
  return <authContext.Provider value={user}>{children}</authContext.Provider>;

}