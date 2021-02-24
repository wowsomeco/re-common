import { useHistory } from 'react-router-dom';
import { useAsync } from 'react-use';

import { PAGE_NOT_FOUND } from '~app/scripts/constants';
import { useFetch } from '~w-common/hooks';

interface FetchOneProps<T> {
  result: T | undefined;
  loading: boolean;
}

/**
 * Wrapper around use fetch that auto redirects to not-found when status code 404 is thrown by the server
 */
const useFetchOne = <T>(
  endpoint: string,
  execOnMounted: boolean
): FetchOneProps<T> => {
  const history = useHistory();
  const { submit, loading, result } = useFetch<T>('GET', endpoint, false);

  useAsync(async () => {
    if (execOnMounted) {
      const { status } = await submit();
      if (status === 404) {
        history.push(PAGE_NOT_FOUND);
      }
    }
  }, [endpoint]);

  return {
    result,
    loading
  };
};

export default useFetchOne;
