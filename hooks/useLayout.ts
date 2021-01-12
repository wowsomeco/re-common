import { useContext, createContext } from 'react';

export type LayoutProvider = {
  sideCollapsed: boolean;
  collapseSide: (flag: boolean) => void;
  toggleCollapse: () => void;
};

export const LayoutContext = createContext<LayoutProvider>(undefined);

export const useLayoutProvider = (): LayoutProvider => useContext(LayoutContext);