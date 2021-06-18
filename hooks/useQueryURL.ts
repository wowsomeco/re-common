import { useLocation } from 'react-router-dom';

/**
 * A custom hook that builds on useLocation to parse
 * the query string for you.
 * source: https://reactrouter.com/web/example/query-parameters
 * @returns query object, usage: query.get("name")
 */
const useQueryURL = (): URLSearchParams => {
  return new URLSearchParams(useLocation().search);
};

export default useQueryURL;
