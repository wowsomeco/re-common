import { useContext, createContext } from 'react';
import { AuthModel } from '../../app/models';

export type AuthProvider = {
  login: (params: any) => Promise<any>;
  logout: () => Promise<void | false | string>;
  checkAuth: () => Promise<AuthModel>;
};

export const AuthContext = createContext<AuthProvider>(undefined);

export const useAuthProvider = (): AuthProvider => useContext(AuthContext);