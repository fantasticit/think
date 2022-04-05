import type { IUser, ILoginUser } from '@think/domains';
import useSWR from 'swr';
import { useCallback, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { HttpClient } from 'services/http-client';
import { getStorage, setStorage } from 'helpers/storage';

export const useUser = () => {
  const router = useRouter();
  const { data, error, mutate } = useSWR<ILoginUser>('user', getStorage);

  const logout = useCallback(() => {
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('token');
    mutate(null);
    Router.replace('/login');
  }, []);

  const login = useCallback((data) => {
    HttpClient.post<IUser>('/user/login', data).then((res) => {
      const user = res as unknown as ILoginUser;
      mutate(user);
      setStorage('user', JSON.stringify(user));
      user.token && setStorage('token', user.token);
      const next = router.query?.redirect || '/';
      Router.replace(next as string);
    });
  }, []);

  const updateUser = async (patch: Pick<IUser, 'email' | 'avatar'>) => {
    const res = await HttpClient.patch('/user/update', patch);
    const ret = { ...data, ...res } as unknown as ILoginUser;
    setStorage('user', JSON.stringify(ret));
    mutate(ret);
  };

  useEffect(() => {
    mutate();
  }, []);

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
