import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { PAGE_LOGIN } from '../scripts/constants';
import { useAuthProvider } from './useAuthProvider';

type Logout = () => Promise<any>;

export const useLogout = (): Logout => {
  const authProvider = useAuthProvider();
  const history = useHistory();

  const logout = useCallback(
    () => authProvider.logout().then(resp => {
      history.push(PAGE_LOGIN);
      return resp;
    }),
    [authProvider, history]
  );

  return logout;
};