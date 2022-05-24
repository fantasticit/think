import { ILoginUser, IUser, UserApiDefinition } from '@think/domains';
import { getStorage, setStorage } from 'helpers/storage';
import Router, { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import { HttpClient } from 'services/http-client';

export const useUser = () => {
  const router = useRouter();
  const { data, error, refetch } = useQuery<ILoginUser>('user', () => {
    return getStorage('user');
  });

  const logout = useCallback(() => {
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('token');
    refetch();
    HttpClient.request({
      method: UserApiDefinition.logout.method,
      url: UserApiDefinition.logout.client(),
    }).then(() => {
      Router.replace('/login');
    });
  }, [refetch]);

  const login = useCallback(
    (data) => {
      return HttpClient.request({
        method: UserApiDefinition.login.method,
        url: UserApiDefinition.login.client(),
        data,
      }).then((res) => {
        const user = res as unknown as ILoginUser;
        refetch();
        setStorage('user', JSON.stringify(user));
        user.token && setStorage('token,', user.token);
        const next = router.query?.redirect || '/';
        Router.replace(next as string);
      });
    },
    [refetch, router.query?.redirect]
  );

  const updateUser = async (patch: Pick<IUser, 'email' | 'avatar'>) => {
    const res = await HttpClient.patch('/user/update', patch);
    const ret = { ...data, ...res } as unknown as ILoginUser;
    setStorage('user', JSON.stringify(ret));
    refetch();
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

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
