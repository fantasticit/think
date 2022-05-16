import type { ILoginUser, IUser } from '@think/domains';
import { getStorage, setStorage } from 'helpers/storage';
import Router, { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { HttpClient } from 'services/http-client';
import useSWR from 'swr';

export const useUser = () => {
  const router = useRouter();
  const { data, error, mutate } = useSWR<ILoginUser>('user', getStorage);

  const logout = useCallback(() => {
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('token');
    mutate(null);
    Router.replace('/login');
  }, [mutate]);

  const login = useCallback(
    (data) => {
      HttpClient.post<IUser>('/user/login', data).then((res) => {
        const user = res as unknown as ILoginUser;
        mutate(user);
        setStorage('user', JSON.stringify(user));
        user.token && setStorage('token', user.token);
        const next = router.query?.redirect || '/';
        Router.replace(next as string);
      });
    },
    [mutate, router.query?.redirect]
  );

  const updateUser = async (patch: Pick<IUser, 'email' | 'avatar'>) => {
    const res = await HttpClient.patch('/user/update', patch);
    const ret = { ...data, ...res } as unknown as ILoginUser;
    setStorage('user', JSON.stringify(ret));
    mutate(ret);
  };

  useEffect(() => {
    mutate();
  }, [mutate]);

  return {
    user: data,
    loading: false,
    error: data ? null : error,
    gotoLogin: logout,
    login,
    logout,
    updateUser,
  };
};
