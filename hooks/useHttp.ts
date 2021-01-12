import { useEffect, useState } from 'react';
import { useAppProvider } from '../contexts/appContext';

const baseReq: Partial<RequestInit> = {
  credentials: 'include',
};

const jsonReq: Partial<RequestInit> = {
  ...baseReq,
  ...{
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

export type GetState = {
  loading: boolean;
  result: any;
};

export const useGet = (endpoint: string): GetState => {
  const { apiUrl } = useAppProvider();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(undefined);

  const req: RequestInit = {
    ...jsonReq,
    ...{
      method: 'GET',
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const response: Response = await fetch(apiUrl(endpoint), req);
      // TODO: do something here according to the http status code later...

      setLoading(false);
      setResult(await response.json());
    };

    fetchData();
  }, [endpoint]);

  return { loading, result };
};