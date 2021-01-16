import { useState } from 'react';

import { useAppProvider } from '../contexts/appContext';
import { subDomain } from '../scripts';
import { useIsMounted } from './utils';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

type Resp = {
  status: number;
  ok: boolean;
  data: any;
};

export type FetchState = {
  loading: boolean;
  result: any;
  submit: (body?: any | null) => Promise<Resp>;
};

/**
 * The fetch api hook, utilizing fetch under the hood.
 * TODO: more docs coming soon
 * 
 * @param method the Http Method (GET,POST,PUT,DELETE)
 * @param endpoint the rest api endpoint without the prefix forward slash
 */
export const useFetch = (method: Method, endpoint: string): FetchState => {
  const { apiUrl, checkToken, tenantKey } = useAppProvider();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(undefined);
  const mounted = useIsMounted();

  const submit = async (body?: any | null): Promise<Resp> => {
    setLoading(true);

    // if tenantKey is defined, then set it with the cur window subdomain as the value.
    const req: RequestInit = {
      method,
      body: JSON.stringify(body),
      headers: {
        ...{
          'Authorization': checkToken(),
          'Content-Type': 'application/json',
        },
        ...(tenantKey && { [tenantKey]: subDomain() })
      }
    };

    const response: Response = await fetch(apiUrl(endpoint), req);
    // TODO: partially done, e.g. need to handle different http status code from the backend...
    // e.g. callbacks when unauthorized, etc...
    const status = response.status;
    const ok = response.ok;
    const data = await response.json();
    // dont change state when no longer mounted
    if (mounted()) {
      setLoading(false);
      setResult(data);
    }

    return { status, ok, data };
  };

  return { loading, result, submit };
};