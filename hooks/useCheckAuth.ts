import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthModel } from '../../app/models';
import { useAuthProvider } from './useAuthProvider';
import { useLogout } from './useLogout';

export const useCheckAuth = (): [AuthModel] => {
  const [model, setModel] = useState<AuthModel>(undefined);
  const authProvider = useAuthProvider();
  const logout = useLogout();

  authProvider.checkAuth().then(model => {
    setModel(model);
  }).catch(() => logout());

  return [model];
};

export const useCheckLogin = (): [boolean] => {
  const [loggedIn, setLoggedIn] = useState(undefined);
  const authProvider = useAuthProvider();
  const history = useHistory();

  useEffect(() => {
    authProvider.checkAuth().then(_ => {
      history.push('/');
    }).catch(() => setLoggedIn(false));
  }, []);

  return [loggedIn];
};