import { useContext, createContext } from 'react';

export type AppProvider = {
  apiUrl: (params: string) => string;
};

export const AppContext = createContext<AppProvider>(undefined);

export const useAppProvider = (): AppProvider => useContext(AppContext);