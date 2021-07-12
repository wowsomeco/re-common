import { useAsync } from 'react-use';

import { useFetchJson, useStatelessFetchJson } from '~w-common/hooks';
import { useSafeState } from '~w-common/hooks/useSafeState';

export class FetchListState {
  constructor(
    /** the limit per page */
    public limit: number = 0,
    /** the current page */
    public page: number = 1,
    /** max items */
    public count: number = -1
  ) {
    // anticipate stupidity should there be given decimal numbers
    this.limit = Math.floor(this.limit);
    this.page = Math.floor(this.page);
    this.count = Math.floor(this.count);
  }

  /** The item length per page */
  get countByLimit(): number {
    return Math.ceil(this.count / this.limit);
  }

  /** The limit offset */
  get offset(): number {
    return this.limit * (this.page - 1);
  }

  /**
   * the query params that will be concatenated with the API url, if any
   * e.g. ?limit=10&offset=10
   */
  query(): string {
    // TODO: refactor this later for since it's getting ugly already
    const lim = this.limit ? `limit=${this.limit}` : '';
    const offset = this.page > 1 ? `offset=${this.offset}` : '';

    return (lim || offset ? '?' : '') + lim + (offset ? '&' : '') + offset;
  }
}

interface FetchListProps<T> {
  /** the max length of the items */
  count: number;
  /** the current page */
  page: number;
  /** callback to change the cur page */
  setPage: (page: number) => void;
  /** the current paginated items */
  result: T[] | undefined;
  /** will be set to true, when currently fetching the count / data from API */
  loading: boolean;
  /** can be used to reload the cur page */
  doFetch: () => Promise<void>;
}

/**
 * Hook that fetches an array of item from the backend on mounted
 * TODO: optimize later, reduce render count
 *
 * @param endpoint the items API url `required`
 * @param countEndpoint the count API for the items `required`
 * @param defaultState the default state `optional`
 */
const useFetchList = <T>(
  endpoint: string,
  countEndpoint: string,
  defaultState: FetchListState = new FetchListState(5)
): FetchListProps<T> => {
  const [state, setState] = useSafeState<FetchListState>(defaultState);

  const { submit: fetchCount } = useStatelessFetchJson<Record<string, number>>({
    method: 'GET',
    endpoint: countEndpoint
  });

  const { submit, loading, result } = useFetchJson<T[]>(
    { method: 'GET', endpoint },
    true
  );

  // callback from parent to reset state of the current page
  const setPage = (p: number) => {
    if (state.page !== p) setState((prev) => new FetchListState(prev.limit, p));
  };

  // fetch the items from the backend
  const doFetch = async () => {
    await submit({ query: state.query() });
  };

  // effect that gets called on mounted OR
  // the cur state get modified
  useAsync(async () => {
    // initially, if countEndpoint is provided, get the count first
    // then fetch the items afterwards
    const shouldFetchCount = countEndpoint && state.count < 0;

    if (shouldFetchCount) {
      const { data } = await fetchCount();
      setState(
        (prev) => new FetchListState(prev.limit, prev.page, data?.count)
      );
    } else {
      await doFetch();
    }
  }, [state]);

  return {
    count: state.countByLimit,
    page: state.page,
    setPage,
    result,
    loading,
    doFetch
  };
};

export default useFetchList;
