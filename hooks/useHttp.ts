import { useState } from 'react';
import { useAppProvider } from '../contexts/appContext';

const jsonReq: Partial<RequestInit> = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export type FetchState = {
  loading: boolean;
  result: any;
};

export type FetchActionState = FetchState & {
  submit: (body?: any | null) => void;
};

export type GetState = FetchState & {
  get: () => void;
};

export type PostState = FetchState & {
  post: (payload: any) => void;
};

export const useFetch = (endpoint: string, req: RequestInit): FetchActionState => {
  const { apiUrl } = useAppProvider();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(undefined);

  const submit = async (body?: any) => {
    setLoading(true);

    const response: Response = await fetch(
      apiUrl(endpoint),
      { ...jsonReq, ...req, ...{ body: JSON.stringify(body) } }
    );

    // TODO: partially done, e.g. need to handle different http status code from the backend...
    // e.g. callbacks for unauthorized, etc...

    const json = await response.json();

    if (!response.ok) {
      alert(json.error);
    }

    setLoading(false);
    setResult(json);
  };

  return { loading, result, submit };
};

export const useGet = (endpoint: string): GetState => {
  const { loading, result, submit } = useFetch(endpoint, { method: 'GET' });
  const get = async () => submit();

  return { loading, result, get };
};

export const usePost = (endpoint: string): PostState => {
  const { loading, result, submit } = useFetch(endpoint, { method: 'POST' });
  const post = async (payload: any) => submit(payload);

  return { loading, result, post };
};