import { useContext, createContext } from 'react';

export type AppProvider = {
  profile: any;
  apiUrl: (params: string) => string;
  onAuthenticated: (model: any, token: string) => void;
  checkToken: () => string | null;
};

export const AppContext = createContext<AppProvider>(undefined);

export const useAppProvider = (): AppProvider => useContext(AppContext);