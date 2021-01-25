import * as React from 'react';

export type AppTheme = {
  /** css classes applied to input field */
  inputClass: string;
  /** css classes applied to label input field */
  labelClass: string;
  /** css classes applied to buttons */
  buttonClass?: string;
};

/**
 * Global context of the app.
 * consists of all the stuff that needs to be defined once only.
 * once it's too overwhelming, we might split it into multiple contexts later on.
 * e.g. http stuff as one HttpContext, ThemeContext, etc
 */
export type AppProvider = {
  appName: string;
  /**
   * This is the key that differentiates each tenant sent in the http header based on the current subdomain.
   * a bit opinionated here, hence nullable, but let's see
   */
  tenantKey?: string;
  theme: AppTheme;
  /** The current logged in user */
  profile: any;
  /** The base url of the rest api, acts like a callback that concats the base url with the given param for simplicity for now */
  apiUrl: (params: string) => string;
  onAuthenticated: (model: any, token: string) => void;
  checkToken: () => string | null;
  logout: () => void;
  /** Global notification */
  notif: (msg: string, status: 'info' | 'error') => void;
};

export const AppContext = React.createContext<AppProvider>(undefined);

export const useAppProvider = (): AppProvider => React.useContext(AppContext);
