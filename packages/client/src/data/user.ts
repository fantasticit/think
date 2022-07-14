import { Toast } from '@douyinfe/semi-ui';
import { ILoginUser, ISystemConfig, IUser, SystemApiDefinition, UserApiDefinition } from '@think/domains';
import { getStorage, setStorage } from 'helpers/storage';
import { useAsyncLoading } from 'hooks/use-async-loading';
import Router, { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import { HttpClient } from 'services/http-client';

/**
 * 直接去登录页
 */
export const toLogin = () => {
  const currentPath = Router.asPath;
  const maybeRedirect = Router.query?.redirect;
  const isInLogin = currentPath.startsWith('login');

  if (!isInLogin) {
    let next = maybeRedirect || currentPath;

    if (next.includes('login')) {
      next = '/app';
    }

    Router.replace(`/login?redirect=${next}`);
  }
};

/**
 * 获取验证码
 * @returns
 */
export const useVerifyCode = () => {
  const [sendVerifyCode, loading] = useAsyncLoading((params: { email: string }) =>
    HttpClient.request({
      method: UserApiDefinition.sendVerifyCode.method,
      url: UserApiDefinition.sendVerifyCode.client(),
      params,
    })
  );

  return {
    sendVerifyCode,
    loading,
  };
};

/**
 * 注册
 * @returns
 */
export const useRegister = () => {
  const [registerWithLoading, loading] = useAsyncLoading((data) =>
    HttpClient.request({
      method: UserApiDefinition.register.method,
      url: UserApiDefinition.register.client(),
      data,
    })
  );

  return {
    register: registerWithLoading,
    loading,
  };
};

/**
 * 重置密码
 * @returns
 */
export const useResetPassword = () => {
  const [resetPasswordWithLoading, loading] = useAsyncLoading((data) =>
    HttpClient.request({
      method: UserApiDefinition.resetPassword.method,
      url: UserApiDefinition.resetPassword.client(),
      data,
    })
  );

  return {
    reset: resetPasswordWithLoading,
    loading,
  };
};

export const useUser = () => {
  const router = useRouter();
  const { data, error, refetch } = useQuery<ILoginUser>('user', () => {
    return getStorage('user');
  });

  /**
   * 清除用户信息后跳到登录页
   */
  const logout = useCallback(() => {
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('token');
    refetch();
    HttpClient.request({
      method: UserApiDefinition.logout.method,
      url: UserApiDefinition.logout.client(),
    }).then(() => {
      const isInShare = Router.asPath.startsWith('/share');
      if (isInShare) return;
      toLogin();
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
        user.token && setStorage('token', user.token);
        const next = router.query?.redirect || '/app';
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
    toLogin,
    login,
    logout,
    updateUser,
  };
};

export const useSystemPublicConfig = () => {
  const { data, error, isLoading, refetch } = useQuery(SystemApiDefinition.getPublicConfig.client(), () =>
    HttpClient.request<ISystemConfig>({
      method: SystemApiDefinition.getPublicConfig.method,
      url: SystemApiDefinition.getPublicConfig.client(),
    })
  );

  return { data, error, loading: isLoading, refresh: refetch };
};

export const useSystemConfig = () => {
  const { data, error, isLoading, refetch } = useQuery(UserApiDefinition.getSystemConfig.client(), () =>
    HttpClient.request<ISystemConfig>({
      method: UserApiDefinition.getSystemConfig.method,
      url: UserApiDefinition.getSystemConfig.client(),
    })
  );

  const sendTestEmail = useCallback(async () => {
    return await HttpClient.request<ISystemConfig>({
      method: UserApiDefinition.sendTestEmail.method,
      url: UserApiDefinition.sendTestEmail.client(),
    }).then(() => {
      Toast.success('测试邮件发送成功');
    });
  }, []);

  const updateSystemConfig = useCallback(
    async (data: Partial<ISystemConfig>) => {
      const ret = await HttpClient.request<ISystemConfig>({
        method: UserApiDefinition.updateSystemConfig.method,
        url: UserApiDefinition.updateSystemConfig.client(),
        data,
      });
      refetch();
      return ret;
    },
    [refetch]
  );

  return { data, error, loading: isLoading, refresh: refetch, sendTestEmail, updateSystemConfig };
};
