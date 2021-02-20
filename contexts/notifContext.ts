import * as React from 'react';

import Observable from '~w-common/scripts/observable';

export type NotifState = 'info' | 'error';

export interface NotifContent {
  msg: string;
  state: NotifState;
}

/**
 * Global Notif context of the app.
 */
export interface NotifProvider {
  /** Global notification */
  notif: Observable<NotifContent | undefined>;
  theme: Record<NotifState, string>;
}

export const NotifContext = React.createContext<NotifProvider>(
  {} as NotifProvider
);

export const useNotifProvider = (): NotifProvider =>
  React.useContext(NotifContext);
