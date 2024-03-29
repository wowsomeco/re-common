import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAsync, useMountedState } from 'react-use';

import { useFetchJson } from '~w-common/hooks';

export interface FetchOneProps<T> {
  result: T | undefined;
  loading: boolean;
  /** can be used to re fetch the data again by the caller*/
  doFetch: () => Promise<void>;
}

/**
 * Wrapper around use fetch that auto redirects to not-found when status code 404 is thrown by the server
 */
const useFetchOne = <T>(
  endpoint: string,
  execOnMounted: boolean,
  notFoundPage: string = '/not-found'
): FetchOneProps<T> => {
  const history = useHistory();
  const { result, loading, submit } = useFetchJson<T>(
    {
      method: 'GET',
      endpoint
    },
    execOnMounted
  );

  // to block result from useFetchJson before passed into component
  const [isCheckStatus, setCheckStatus] = React.useState(false);

  const isMounted = useMountedState();

  // fetch the items from the backend
  const doFetch = async () => {
    setCheckStatus(true);
    const { status } = await submit();

    if (isMounted()) {
      if (status === 404) {
        history.push(notFoundPage);
      } else {
        setCheckStatus(false);
      }
    }
  };

  // do fetch on mounted if execOnMounted is true OR when the endpoint changes.
  useAsync(async () => {
    if (execOnMounted) await doFetch();
  }, [endpoint]);

  return {
    result: isCheckStatus ? undefined : result,
    loading: isCheckStatus ? true : loading,
    doFetch
  };
};

export default useFetchOne;
