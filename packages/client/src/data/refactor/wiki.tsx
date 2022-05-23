import {
  CollectorApiDefinition,
  CollectorApiTypeDefinition,
  CollectType,
  IUser,
  IWiki,
  IWikiUser,
  WikiApiDefinition,
} from '@think/domains';
import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { HttpClient } from 'services/http-client';

export type ICreateWiki = Pick<IWiki, 'name' | 'description'>;
export type IUpdateWiki = Partial<IWiki>;
export type IWikiUserOpeateData = {
  userName: Pick<IUser, 'name'>;
  userRole: Pick<IWikiUser, 'userRole'>;
};

/**
 * 获取用户所有知识库
 * @returns
 */
export const getAllWikis = (cookie = null): Promise<{ data: IWiki[]; total: number }> => {
  return HttpClient.request({
    method: WikiApiDefinition.getAllWikis.method,
    url: WikiApiDefinition.getAllWikis.client(),
    headers: {
      cookie,
    },
  });
};

/**
 * 获取用户所有知识库
 * @returns
 */
export const useAllWikis = () => {
  const { data, error, isLoading } = useQuery(WikiApiDefinition.getAllWikis.client(), getAllWikis);
  const list = (data && data.data) || [];
  const total = (data && data.total) || 0;
  return { data: list, total, error, loading: isLoading };
};

/**
 * 获取用户参与的知识库
 * @returns
 */
export const getJoinWikis = (cookie = null): Promise<{ data: IWiki[]; total: number }> => {
  return HttpClient.request({
    method: WikiApiDefinition.getJoinWikis.method,
    url: WikiApiDefinition.getJoinWikis.client(),
    headers: {
      cookie,
    },
  });
};

/**
 * 获取用户参与的知识库
 * @returns
 */
export const useJoinWikis = () => {
  const { data, error, isLoading } = useQuery(WikiApiDefinition.getJoinWikis.client(), getJoinWikis);
  const list = (data && data.data) || [];
  const total = (data && data.total) || 0;

  return { data: list, total, error, loading: isLoading };
};

/**
 * 获取用户创建的知识库
 * @returns
 */
export const getOwnWikis = (cookie = null): Promise<{ data: IWiki[]; total: number }> => {
  return HttpClient.request({
    method: WikiApiDefinition.getOwnWikis.method,
    url: WikiApiDefinition.getOwnWikis.client(),
    headers: {
      cookie,
    },
  });
};

/**
 * 获取用户创建的知识库
 * @returns
 */
export const useOwnWikis = () => {
  const { data, error, refetch } = useQuery(WikiApiDefinition.getOwnWikis.client(), getOwnWikis);

  const createWiki = useCallback(
    async (data: ICreateWiki) => {
      const res = await HttpClient.request({
        method: WikiApiDefinition.add.method,
        url: WikiApiDefinition.add.client(),
        data,
      });
      refetch();
      return res;
    },
    [refetch]
  );

  /**
   * 删除文档
   * @param id
   * @returns
   */
  const deletWiki = useCallback(
    async (id) => {
      const res = await HttpClient.request({
        method: WikiApiDefinition.deleteById.method,
        url: WikiApiDefinition.deleteById.client(id),
      });
      refetch();
      return res;
    },
    [refetch]
  );

  const loading = !data && !error;
  const list = (data && data.data) || [];
  const total = (data && data.total) || 0;

  return { data: list, total, error, loading, createWiki, deletWiki };
};

/**
 * 获取所有公开文档
 * @param documentId
 * @returns
 */
export const getAllPublicWikis = (
  page = 1,
  cookie = null
): Promise<{
  data: Array<IWiki>;
  total: number;
}> => {
  return HttpClient.request({
    method: WikiApiDefinition.getPublicWikis.method,
    url: WikiApiDefinition.getPublicWikis.client(),
    headers: {
      cookie,
    },
    params: {
      page,
    },
  });
};
/**
 * 获取所有公开文档
 * @param documentId
 * @returns
 */
export const useAllPublicWikis = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useQuery(`${WikiApiDefinition.getPublicWikis.client()}?page=${page}`, () =>
    getAllPublicWikis(page)
  );

  return {
    data,
    loading: isLoading,
    error,
    setPage,
  };
};
