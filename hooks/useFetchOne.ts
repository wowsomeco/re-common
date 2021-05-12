import { useHistory } from 'react-router-dom';
import { useAsync } from 'react-use';

import { PAGE_NOT_FOUND } from '~app/scripts/constants';
import { useFetchJson } from '~w-common/hooks';

interface FetchOneProps<T> {
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
  execOnMounted: boolean
): FetchOneProps<T> => {
  const history = useHistory();
  const { submit, loading, result } = useFetchJson<T>({
    method: 'GET',
    endpoint
  });

  // fetch the items from the backend
  const doFetch = async () => {
    const { status } = await submit();
    if (status === 404) {
      history.push(PAGE_NOT_FOUND);
    }
  };
  // do fetch on mounted if execOnMounted is true OR when the endpoint changes.
  useAsync(async () => {
    if (execOnMounted) await doFetch();
  }, [endpoint]);

  return {
    result,
    loading,
    doFetch
  };
};

export default useFetchOne;
