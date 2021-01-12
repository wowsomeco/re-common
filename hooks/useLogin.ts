import { useCallback } from 'react';
import { useAuthProvider } from './useAuthProvider';
import { useLocation, useHistory } from 'react-router-dom';

export const useLogin = (): Login => {
  const authProvider = useAuthProvider();
  const history = useHistory();
  const location = useLocation();
  const locationState = location.state as any;
  const nextPathName = locationState && locationState.nextPathname;

  const login = useCallback(
    (params: any = {}) =>
      new Promise((resolve, reject) => {
        authProvider.login(params).then(_ => {
          // redirect to home on success
          history.push('/');
        }).catch(err => {
          alert(err);
          reject();
        });
      }),
    [authProvider, history, nextPathName]
  );

  return login;
};

type Login = (params: any) => Promise<any>;