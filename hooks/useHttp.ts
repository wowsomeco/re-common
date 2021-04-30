import 'isomorphic-fetch';

import * as React from 'react';
import { useMountedState } from 'react-use';

import { useAppProvider } from '../contexts/appContext';
import { subDomain } from '../scripts';

export type HttpContentType = 'application/json' | 'multipart/form-data';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/** The response from the rest API */
export interface Resp<T> {
  /** Http status code */
  status: number;
  /** Http ok status */
  ok: boolean;
  /** the response json body */
  data?: T;
  /** the error response, if any */
  error?: string;
}

/**
 * The return params that gets called by [[useStatelessFetch]]
 */
export interface FetchStatelessCb<T> {
  /** a function that can be used to fetch from the server */
  submit: (body?: any | null, query?: any | undefined) => Promise<Resp<T>>;
}

/**
 * The return params that gets called by [[useFetch]]
 */
export interface FetchProps<T> extends FetchStatelessCb<T> {
  /** set to true when fetching */
  loading: boolean;
  /** The response from the backend on fetched */
  result: T | undefined;
}

type FetchState<T> = {
  loading: boolean;
  result?: T | undefined;
};

/**
 * Hook that wraps fetch with app context configuration accordingly.
 * This hook is stateless, it only returns the callback function for submitting.
 *
 * @returns submit callback that can be triggered by the caller.
 * @param method Http Method
 * @param endpoint API URL
 */
export const useStatelessFetch = <T>(
  method: HttpMethod,
  endpoint: string,
  contentType: HttpContentType = 'application/json'
): FetchStatelessCb<T> => {
  const { apiUrl, checkToken, tenantKey } = useAppProvider();
  const headers: HeadersInit = {
    'Content-Type': contentType
  };
  // check first if token is provided
  const token = checkToken();
  if (token) headers['Authorization'] = token;
  // check first whether tenantKey is defined
  if (tenantKey) headers[tenantKey] = subDomain();

  const submit = async (
    body?: BodyInit | null,
    query: string | undefined = undefined
  ): Promise<Resp<T>> => {
    let theBody = body;
    // TODO: might need to test it for different use cases later
    // check if the content type is json
    if (contentType === 'application/json') {
      // if the body is not string e.g. a plain object, convert it to string
      const shouldStringify = !!theBody && typeof theBody !== 'string';
      if (shouldStringify) {
        theBody = JSON.stringify(body);
      }
    }
    // if tenantKey is defined, then set it with the cur window subdomain as the value.
    const req: RequestInit = {
      method,
      body: theBody,
      headers: headers
    };

    const response: Response = await fetch(
      apiUrl(endpoint + (query ?? '')),
      req
    );
    // TODO: partially done, e.g. need to handle different http status code from the backend...
    // e.g. callbacks when unauthorized, etc...
    const status = response.status;
    const ok = response.ok;
    const data = await response.json();
    const error = data?.error;

    return { status, ok, data, error };
  };

  return { submit };
};

/**
 * The fetch api hook, utilizing fetch under the hood.
 * This hook is stateful
 * @see [[FetchProps]] for more details about what the caller can do with this hook.
 *
 * @param method the Http Method (GET,POST,PUT,DELETE)
 * @param endpoint the rest api endpoint without the prefix forward slash (/)
 */
export const useFetch = <T>(
  method: HttpMethod,
  endpoint: string,
  defaultLoading = false,
  contentType: HttpContentType = 'application/json'
): FetchProps<T> => {
  const [state, setState] = React.useState<FetchState<T>>({
    loading: defaultLoading,
    result: undefined
  });

  const { submit: doFetch } = useStatelessFetch<T>(
    method,
    endpoint,
    contentType
  );

  const isMounted = useMountedState();

  const submit = async (
    body?: any | null,
    query: string | undefined = undefined
  ): Promise<Resp<T>> => {
    if (!state.loading) setState({ loading: true, result: undefined });

    const { status, ok, data, error } = await doFetch(body, query);

    // dont change state when no longer mounted
    if (isMounted()) {
      setState({ loading: false, result: data });
    }

    return { status, ok, data, error };
  };

  return { loading: state.loading, result: state.result, submit };
};
