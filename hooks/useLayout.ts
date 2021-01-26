import * as React from 'react';

export type LayoutProvider = {
  sideCollapsed: boolean;
  collapseSide: (flag: boolean) => void;
  toggleCollapse: () => void;
};

export const LayoutContext = React.createContext<LayoutProvider>(undefined);

export const useLayoutProvider = (): LayoutProvider =>
  React.useContext(LayoutContext);
