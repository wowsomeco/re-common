import { useState } from 'react';
import { useAppProvider } from '../contexts/appContext';

const jsonReq: Partial<RequestInit> = {
  headers: {
    'Content-Type': 'application/json'
  }
};

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

export const useFetch = (method: Method, endpoint: string): FetchState => {
  const { apiUrl } = useAppProvider();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(undefined);

  const submit = async (body?: any | null): Promise<Resp> => {
    setLoading(true);

    const response: Response = await fetch(
      apiUrl(endpoint),
      { ...jsonReq, ...{ method, body: JSON.stringify(body) } }
    );

    // TODO: partially done, e.g. need to handle different http status code from the backend...
    // e.g. callbacks for unauthorized, etc...
    const status = response.status;
    const data = await response.json();
    const ok = response.ok;

    setLoading(false);
    setResult(data);

    return { status, ok, data };
  };

  return { loading, result, submit };
};