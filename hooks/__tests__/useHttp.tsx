import { render, screen } from '@testing-library/react';
import * as React from 'react';

import { AppContext, AppProvider } from '../../contexts/appContext';
import { useFetch, useStatelessFetch } from '../useHttp';

type UserData = {
  id: number;
  name: string;
  username: string;
};

const StatelessFetchTest: React.FC = () => {
  const { submit } = useStatelessFetch<UserData[]>('GET', 'users');
  const [items, setItems] = React.useState<UserData[]>([]);

  React.useEffect(() => {
    const doFetch = async () => {
      const { data } = await submit();
      setItems(data);
    };

    doFetch();
  }, []);

  const renderItems: React.ReactNode[] = [];

  items.forEach((item, i) => {
    renderItems.push(<p key={i}>{item.name}</p>);
  });

  return <>{renderItems}</>;
};

const FetchTest: React.FC = () => {
  const { submit, loading, result } = useFetch<UserData[]>(
    'GET',
    'users',
    true
  );

  React.useEffect(() => {
    const doFetch = async () => {
      await submit();
    };

    doFetch();
  }, []);

  const renderItems: React.ReactNode[] = [];

  result?.forEach((item, i) => {
    renderItems.push(<p key={i}>{item.name}</p>);
  });

  return <>{loading ? <p>Loading</p> : renderItems}</>;
};

const appProvider: AppProvider = {
  profile: null,
  appName: 'Sertifikasi Petani',
  apiUrl: (endpoint) => `https://jsonplaceholder.typicode.com/${endpoint}`,
  onAuthenticated: () => {},
  checkToken: () => 'test',
  logout: () => {},
  notif: () => {}
};

describe('useStatelessFetch test', () => {
  test('Can render data from fetch response', async () => {
    render(
      <AppContext.Provider value={appProvider}>
        <StatelessFetchTest />
      </AppContext.Provider>
    );

    expect(await screen.findByText('Leanne Graham')).toBeInTheDocument();
  });
});

describe('useFetch test', () => {
  test('Can render loading first before showing the response', async () => {
    render(
      <AppContext.Provider value={appProvider}>
        <FetchTest />
      </AppContext.Provider>
    );

    expect(await screen.findByText('Loading')).toBeInTheDocument();
    expect(await screen.findByText('Leanne Graham')).toBeInTheDocument();
  });
});
