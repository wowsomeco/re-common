import { useContext, createContext } from 'react';

export interface IAuthModel { }

export type AppProvider = {
  profile: IAuthModel;
  apiUrl: (params: string) => string;
  onAuthenticated: (model: IAuthModel, token: string) => void;
  checkToken: () => string | null;
};

export const AppContext = createContext<AppProvider>(undefined);

export const useAppProvider = (): AppProvider => useContext(AppContext);