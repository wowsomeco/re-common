import { useHistory, useLocation } from 'react-router-dom';

import { Resp } from '~w-common/hooks';

export interface ReloadFormProps<T> {
  reload: (response: Resp<T>) => void;
}

/** removes last path from the cur full path */
const prevPath = (str: string): string => {
  const strs = str.split('/');
  strs.pop();
  return strs.reduce((p, c) => p + '/' + c);
};

/** Uses for reloading form to the updated path after the new one has successfully submitted */
const useReloadForm = <T extends Record<string, any>>(
  idKey: string = 'id'
): ReloadFormProps<T> => {
  const history = useHistory();
  const { pathname } = useLocation();

  const reload = (r: Resp<T>) => {
    const { ok, data } = r;
    const prev = prevPath(pathname);

    if (ok && prev) {
      history.push({ pathname: '/refresh' });
      setTimeout(() => {
        history.replace(`${prev}/${data?.[idKey]}`);
      }, 10);
    }
  };

  return { reload };
};

export default useReloadForm;
