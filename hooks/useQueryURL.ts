import * as React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A custom hook that builds on useLocation to parse
 * the query string.
 * source: https://reactrouter.com/web/example/query-parameters
 * @returns query object, usage: query.get("name")
 */
const useQueryURL = (): URLSearchParams => {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
};

/**
 * useQueryURL returned as object
 * @returns plain object, usage: query[key]
 */
export const useQueryURLObject = (): Record<string, string> => {
  const query = useQueryURL();
  return Object.fromEntries(query);
};

export default useQueryURL;
