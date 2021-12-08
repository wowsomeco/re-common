import 'isomorphic-fetch';

import * as React from 'react';
import { useMountedState } from 'react-use';

import { useAppProvider } from '../contexts/appContext';
import { subDomain } from '../scripts';

export type HttpContentType = 'application/json' | 'multipart/form-data';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/** https://developer.mozilla.org/en-US/docs/Web/API/Body */
export type HttpResponseBodyMethod =
  | 'arrayBuffer'
  | 'blob'
  | 'formData'
  | 'json'
  | 'text';

export type SubmitOptions = {
  body?: any | null;
  /** additional query that gets concatenated with the provided endpoint in [[useStatelessFetch]] on submit */
  query?: string | undefined;
};

export type SubmitCallback<T> = (opts?: SubmitOptions) => Promise<Resp<T>>;

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
  submit: SubmitCallback<T>;
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

export type FetchState<T> = {
  loading: boolean;
  result?: T | undefined;
};

export interface FetchOptionsBase {
  /** the Http Method (GET,POST,PUT,DELETE) */
  method: HttpMethod;
  /** the rest api endpoint without the prefix forward slash (/) */
  endpoint: string;
  /** callbacks by status code */
  statusCallbacks?: Record<number, () => void | Promise<void>>;
}

export interface FetchOptions extends FetchOptionsBase {
  contentType?: HttpContentType;
  expectedResponseType?: HttpResponseBodyMethod;
}

/**
 * Hook that wraps fetch with app context configuration accordingly.
 * This hook is stateless, it only returns the callback function for submitting.
 * TODO: might want to change the params to object later.
 *
 * @returns submit callback that can be triggered by the caller.
 * @param method Http Method
 * @param endpoint API URL
 * @param contentType The content type, one of [[HttpContentType]]
 */
export const useStatelessFetch = <T>(
  options: FetchOptions
): FetchStatelessCb<T> => {
  const {
    method,
    endpoint,
    contentType,
    expectedResponseType = 'json',
    statusCallbacks = {
      401: () =>
        window.location.replace(
          `${window.location.protocol}//${window.location.host}/login`
        )
    }
  } = options;

  const { apiUrl, checkToken, tenantKey } = useAppProvider();
  const headers: HeadersInit = {};
  if (contentType) headers['Content-Type'] = contentType;
  // check first if token is provided
  const token = checkToken();
  if (token) headers['Authorization'] = token;
  // check first whether tenantKey is defined
  if (tenantKey) headers[tenantKey] = subDomain();

  const submit = async (opts: SubmitOptions = {}): Promise<Resp<T>> => {
    const { body, query } = opts;
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

    let data: any;
    let dataTypeError: any;

    try {
      data = await response[expectedResponseType]();
    } catch (err) {
      dataTypeError = err;
    }

    // if status not ok do something based on status
    statusCallbacks?.[status]?.();

    return {
      status,
      ok,
      data,
      error:
        data?.error || dataTypeError || (!ok ? response.statusText : undefined)
    };
  };

  return { submit };
};

export const useStatelessFetchJson = <T>(
  options: FetchOptionsBase
): FetchStatelessCb<T> =>
  useStatelessFetch<T>({ ...options, contentType: 'application/json' });

/**
 * The fetch api hook, utilizing fetch under the hood.
 * This hook is stateful
 * @see [[FetchProps]] for more details about what the caller can do with this hook.
 *
 * @param options the fetch options
 * @param defaultLoading the default value of the loading state, false if undefined
 */
export const useFetch = <T>(
  options: FetchOptions,
  defaultLoading = false
): FetchProps<T> => {
  const [state, setState] = React.useState<FetchState<T>>({
    loading: defaultLoading,
    result: undefined
  });

  const { submit: doFetch } = useStatelessFetch<T>(options);

  const isMounted = useMountedState();

  const submit = async (opts: SubmitOptions = {}): Promise<Resp<T>> => {
    if (!state.loading) setState({ loading: true, result: undefined });

    const { status, ok, data, error } = await doFetch(opts);

    // dont change state when no longer mounted
    if (isMounted()) {
      setState({ loading: false, result: data });
    }

    return { status, ok, data, error };
  };

  return { loading: state.loading, result: state.result, submit };
};

export const useFetchJson = <T>(
  options: FetchOptionsBase,
  defaultLoading?: boolean
): FetchProps<T> =>
  useFetch<T>({ ...options, contentType: 'application/json' }, defaultLoading);
