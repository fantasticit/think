import { IAuth, IOrganization, IUser, OrganizationApiDefinition } from '@think/domains';
import { event, REFRESH_ORGANIZATIONS, triggerRefreshOrganizations } from 'event';
import { useAsyncLoading } from 'hooks/use-async-loading';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { HttpClient } from 'services/http-client';

/**
 * 搜索组织内文档
 * @returns
 */
export const useCreateOrganization = () => {
  const [apiWithLoading, loading] = useAsyncLoading((data) =>
    HttpClient.request<IOrganization>({
      method: OrganizationApiDefinition.createOrganization.method,
      url: OrganizationApiDefinition.createOrganization.client(),
      data,
    })
  );

  return {
    create: apiWithLoading,
    loading,
  };
};

export const getPersonalOrganization = (cookie = null): Promise<IOrganization> => {
  return HttpClient.request({
    method: OrganizationApiDefinition.getPersonalOrganization.method,
    url: OrganizationApiDefinition.getPersonalOrganization.client(),
    cookie,
  });
};

/**
 * 获取个人组织
 * @returns
 */
export const usePeronalOrganization = () => {
  const { data, error, isLoading, refetch } = useQuery(
    OrganizationApiDefinition.getPersonalOrganization.client(),
    getPersonalOrganization
  );
  return { data, error, loading: isLoading, refresh: refetch };
};

export const getUserOrganizations = (cookie = null): Promise<Array<IOrganization>> => {
  return HttpClient.request({
    method: OrganizationApiDefinition.getUserOrganizations.method,
    url: OrganizationApiDefinition.getUserOrganizations.client(),
    cookie,
  });
};

/**
 * 获取用户除个人组织外可访问的组织
 * @returns
 */
export const useUserOrganizations = () => {
  const { data, error, isLoading, refetch } = useQuery(
    OrganizationApiDefinition.getUserOrganizations.client(),
    getUserOrganizations
  );

  useEffect(() => {
    event.on(REFRESH_ORGANIZATIONS, refetch);
    return () => {
      event.off(REFRESH_ORGANIZATIONS, refetch);
    };
  }, [refetch]);

  return { data, error, loading: isLoading, refresh: refetch };
};

export const getOrganizationDetail = (id, cookie = null): Promise<IOrganization> => {
  return HttpClient.request({
    method: OrganizationApiDefinition.getOrganizationDetail.method,
    url: OrganizationApiDefinition.getOrganizationDetail.client(id),
    cookie,
  });
};

/**
 * 获取组织详情
 * @returns
 */
export const useOrganizationDetail = (id) => {
  const { data, error, isLoading, refetch } = useQuery(OrganizationApiDefinition.getOrganizationDetail.client(id), () =>
    getOrganizationDetail(id)
  );

  /**
   * 更新组织信息
   * @param data
   * @returns
   */
  const update = useCallback(
    async (data) => {
      const res = await HttpClient.request({
        method: OrganizationApiDefinition.updateOrganization.method,
        url: OrganizationApiDefinition.updateOrganization.client(id),
        data,
      });
      refetch();
      triggerRefreshOrganizations();
      return res;
    },
    [refetch, id]
  );

  const deleteOrganization = useCallback(async () => {
    const res = await HttpClient.request({
      method: OrganizationApiDefinition.deleteOrganization.method,
      url: OrganizationApiDefinition.deleteOrganization.client(id),
    });
    refetch();
    return res;
  }, [refetch, id]);

  return { data, error, loading: isLoading, refresh: refetch, update, deleteOrganization };
};

export const getOrganizationMembers = (
  id,
  page = 1,
  pageSize,
  cookie = null
): Promise<{ data: Array<{ auth: IAuth; user: IUser }>; total: number }> => {
  return HttpClient.request({
    method: OrganizationApiDefinition.getMembers.method,
    url: OrganizationApiDefinition.getMembers.client(id),
    cookie,
    params: {
      page,
      pageSize,
    },
  });
};

/**
 * 获取组织成员
 * @returns
 */
export const useOrganizationMembers = (id) => {
  const [pageSize] = useState(12);
  const [page, setPage] = useState(1);
  const { data, error, isLoading, refetch } = useQuery([OrganizationApiDefinition.getMembers.client(id), page], () =>
    getOrganizationMembers(id, page, pageSize)
  );

  const addUser = useCallback(
    async (data) => {
      const ret = await HttpClient.request({
        method: OrganizationApiDefinition.addMemberById.method,
        url: OrganizationApiDefinition.addMemberById.client(id),
        data,
      });
      refetch();
      return ret;
    },
    [refetch, id]
  );

  const updateUser = useCallback(
    async (data) => {
      const ret = await HttpClient.request({
        method: OrganizationApiDefinition.updateMemberById.method,
        url: OrganizationApiDefinition.updateMemberById.client(id),
        data,
      });
      refetch();
      return ret;
    },
    [refetch, id]
  );

  const deleteUser = useCallback(
    async (data) => {
      const ret = await HttpClient.request({
        method: OrganizationApiDefinition.deleteMemberById.method,
        url: OrganizationApiDefinition.deleteMemberById.client(id),
        data,
      });
      refetch();
      return ret;
    },
    [refetch, id]
  );

  return {
    data,
    error,
    loading: isLoading,
    page,
    pageSize,
    setPage,
    refresh: refetch,
    addUser,
    updateUser,
    deleteUser,
  };
};
