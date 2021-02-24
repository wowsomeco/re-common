import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

type TableActionProps = {
  toDetail: (id: number | undefined) => void;
  toNew: () => void;
};

export interface TableActionOptions {
  detailsRoute?: string;
}

const removeSlash = (route: string) => route.replaceAll('/', '');
const destRoute = (detailsRoute?: string) =>
  detailsRoute ? `/${removeSlash(detailsRoute)}` : '';

const useTableAction = (options: TableActionOptions): TableActionProps => {
  const { detailsRoute } = options;

  const { pathname } = useLocation();
  const history = useHistory();

  const toDetail = React.useCallback((id: number | undefined) => {
    if (id) history.push(`${pathname}${destRoute(detailsRoute)}/${id}`);
  }, []);

  const toNew = React.useCallback(() => {
    history.push(`${pathname}${destRoute(detailsRoute)}/new`);
  }, []);

  return { toDetail, toNew };
};

export default useTableAction;
