import { IAuth, IDocument, IUser, IWiki, WikiApiDefinition } from '@think/domains';
import { event, REFRESH_TOCS } from 'event';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { HttpClient } from 'services/http-client';

export type ICreateWiki = Pick<IWiki, 'name' | 'description'>;
export type IUpdateWiki = Partial<IWiki>;
export type IWikiWithIsMember = IWiki & { isMember: boolean };

/**
 * 获取用户所有知识库
 * @returns
 */
export const getAllWikis = (organizationId, cookie = null): Promise<{ data: IWiki[]; total: number }> => {
  return HttpClient.request({
    method: WikiApiDefinition.getAllWikis.method,
    url: WikiApiDefinition.getAllWikis.client(organizationId),
    cookie,
  });
};

/**
 * 获取用户所有知识库
 * @returns
 */
export const useAllWikis = (organizationId) => {
  const { data, error, isLoading } = useQuery(WikiApiDefinition.getAllWikis.client(organizationId), () =>
    getAllWikis(organizationId)
  );
  const list = (data && data.data) || [];
  const total = (data && data.total) || 0;
  return { data: list, total, error, loading: isLoading };
};

/**
 * 获取用户参与的知识库
 * @returns
 */
export const getJoinWikis = (organizationId, cookie = null): Promise<{ data: IWiki[]; total: number }> => {
  return HttpClient.request({
    method: WikiApiDefinition.getJoinWikis.method,
    url: WikiApiDefinition.getJoinWikis.client(organizationId),
    cookie,
  });
};

/**
 * 获取用户参与的知识库
 * @returns
 */
export const useJoinWikis = (organizationId) => {
  const { data, error, isLoading } = useQuery(WikiApiDefinition.getJoinWikis.client(organizationId), () =>
    getJoinWikis(organizationId)
  );
  const list = (data && data.data) || [];
  const total = (data && data.total) || 0;

  return { data: list, total, error, loading: isLoading };
};

/**
 * 获取用户创建的知识库
 * @returns
 */
export const getOwnWikis = (organizationId, cookie = null): Promise<{ data: IWiki[]; total: number }> => {
  return HttpClient.request({
    method: WikiApiDefinition.getOwnWikis.method,
    url: WikiApiDefinition.getOwnWikis.client(organizationId),
    cookie,
  });
};

/**
 * 获取用户创建的知识库
 * @returns
 */
export const useOwnWikis = (organizationId) => {
  const { data, error, refetch } = useQuery(WikiApiDefinition.getOwnWikis.client(organizationId), () =>
    getOwnWikis(organizationId)
  );

  const createWiki = useCallback(
    async (data: ICreateWiki) => {
      const res = await HttpClient.request<IWiki>({
        method: WikiApiDefinition.add.method,
        url: WikiApiDefinition.add.client(),
        data: {
          organizationId,
          ...data,
        },
      });
      refetch();
      return res;
    },
    [organizationId, refetch]
  );

  /**
   * 删除知识库
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
    cookie,
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
  const { data, error, isLoading } = useQuery([WikiApiDefinition.getPublicWikis.client(), page], () =>
    getAllPublicWikis(page)
  );

  return {
    data,
    loading: isLoading,
    error,
    page,
    setPage,
  };
};

/**
 * 获取知识库详情
 * @param wikiId
 * @returns
 */
export const getWikiDetail = (wikiId, cookie = null): Promise<IWiki> => {
  return HttpClient.request({
    method: WikiApiDefinition.getDetailById.method,
    url: WikiApiDefinition.getDetailById.client(wikiId),
    cookie,
  });
};

/**
 * 获取知识库详情
 * @param wikiId
 * @returns
 */
export const useWikiDetail = (wikiId) => {
  const { data, error, isLoading, refetch } = useQuery(
    WikiApiDefinition.getDetailById.client(wikiId),
    () => (wikiId ? getWikiDetail(wikiId) : null),
    { staleTime: 3000 }
  );

  /**
   * 更新知识库
   * @param data
   * @returns
   */
  const update = useCallback(
    async (data: IUpdateWiki) => {
      const res = await HttpClient.request({
        method: WikiApiDefinition.updateById.method,
        url: WikiApiDefinition.updateById.client(wikiId),
        data,
      });
      refetch();
      return res;
    },
    [refetch, wikiId]
  );

  /**
   * 公开或私有知识库
   * @param data
   * @returns
   */
  const toggleStatus = useCallback(
    async (data) => {
      const res = await HttpClient.request({
        method: WikiApiDefinition.shareById.method,
        url: WikiApiDefinition.shareById.client(wikiId),
        data,
      });
      refetch();
      return res;
    },
    [refetch, wikiId]
  );

  return { data, loading: isLoading, error, update, toggleStatus };
};

/**
 * 获取知识库文档目录
 * @param workspaceId
 * @returns
 */
export const getWikiTocs = (wikiId, cookie = null): Promise<Array<IDocument & { createUser: IUser }>> => {
  return HttpClient.request({
    method: WikiApiDefinition.getTocsById.method,
    url: WikiApiDefinition.getTocsById.client(wikiId),
    cookie,
  });
};

/**
 * 获取知识库文档目录
 * @param workspaceId
 * @returns
 */
export const useWikiTocs = (wikiId) => {
  const { data, error, refetch } = useQuery(
    WikiApiDefinition.getTocsById.client(wikiId),
    () => (wikiId ? getWikiTocs(wikiId) : null),
    { staleTime: 2000 }
  );
  const loading = !data && !error;

  const update = useCallback(
    async (relations: Array<{ id: string; parentDocumentId: string }>) => {
      const res = await HttpClient.request({
        method: WikiApiDefinition.updateTocsById.method,
        url: WikiApiDefinition.updateTocsById.client(wikiId),
        data: relations,
      });
      refetch();
      return res;
    },
    [refetch, wikiId]
  );

  useEffect(() => {
    event.on(REFRESH_TOCS, refetch);

    return () => {
      event.off(REFRESH_TOCS, refetch);
    };
  }, [refetch]);

  return { data, loading, error, refresh: refetch, update };
};

/**
 * 获取知识库文档目录
 * @param workspaceId
 * @returns
 */
export const getWikiDocuments = (wikiId, cookie = null): Promise<Array<IDocument & { createUser: IUser }>> => {
  return HttpClient.request({
    method: WikiApiDefinition.getDocumentsById.method,
    url: WikiApiDefinition.getDocumentsById.client(wikiId),
    cookie,
  });
};

/**
 * 获取知识库文档
 * @param workspaceId
 * @returns
 */
export const useWikiDocuments = (wikiId) => {
  const { data, error, isLoading, refetch } = useQuery(WikiApiDefinition.getDocumentsById.client(wikiId), () =>
    getWikiDocuments(wikiId)
  );

  useEffect(() => {
    event.on(REFRESH_TOCS, refetch);

    return () => {
      event.off(REFRESH_TOCS, refetch);
    };
  }, [refetch]);

  return { data, loading: isLoading, error, refresh: refetch };
};

/**
 * 获取知识库成员
 * @param wikiId
 * @param cookie
 * @returns
 */
export const getWikiMembers = (
  wikiId,
  page,
  pageSize = 12,
  cookie = null
): Promise<{ data: Array<{ auth: IAuth; user: IUser }>; total: number }> => {
  return HttpClient.request({
    method: WikiApiDefinition.getMemberById.method,
    url: WikiApiDefinition.getMemberById.client(wikiId),
    cookie,
    params: {
      page,
      pageSize,
    },
  });
};

/**
 * 知识库成员管理
 * @param wikiId
 * @returns
 */
export const useWikiMembers = (wikiId) => {
  const [pageSize] = useState(12);
  const [page, setPage] = useState(1);
  const { data, error, isLoading, refetch } = useQuery([WikiApiDefinition.getMemberById.client(wikiId), page], () =>
    getWikiMembers(wikiId, page, pageSize)
  );

  const addUser = useCallback(
    async (data) => {
      const ret = await HttpClient.request({
        method: WikiApiDefinition.addMemberById.method,
        url: WikiApiDefinition.addMemberById.client(wikiId),
        data,
      });
      refetch();
      return ret;
    },
    [refetch, wikiId]
  );

  const updateUser = useCallback(
    async (data) => {
      const ret = await HttpClient.request({
        method: WikiApiDefinition.updateMemberById.method,
        url: WikiApiDefinition.updateMemberById.client(wikiId),
        data,
      });
      refetch();
      return ret;
    },
    [refetch, wikiId]
  );

  const deleteUser = useCallback(
    async (data) => {
      const ret = await HttpClient.request({
        method: WikiApiDefinition.deleteMemberById.method,
        url: WikiApiDefinition.deleteMemberById.client(wikiId),
        data,
      });
      refetch();
      return ret;
    },
    [refetch, wikiId]
  );

  return { data, loading: isLoading, error, page, pageSize, setPage, addUser, updateUser, deleteUser };
};

/**
 * 获取公开知识库首页文档
 * @returns
 */
export const getPublicWikiHomeDocument = (wikiId, cookie = null): Promise<IDocument> => {
  return HttpClient.request({
    method: WikiApiDefinition.getPublicHomeDocumentById.method,
    url: WikiApiDefinition.getPublicHomeDocumentById.client(wikiId),
    cookie,
  });
};

/**
 * 获取公开知识库首页文档
 * @returns
 */
export const usePublicWikiHomeDoc = (wikiId) => {
  const { data, error } = useQuery(
    WikiApiDefinition.getPublicHomeDocumentById.client(wikiId),
    () => getPublicWikiHomeDocument(wikiId),
    { retry: 0 }
  );
  const loading = !data && !error;
  return { data, error, loading };
};

/**
 * 获取公开知识库详情
 * @param wikiId
 * @returns
 */
export const getPublicWikiDetail = (wikiId, cookie = null): Promise<IWiki> => {
  return HttpClient.request({
    method: WikiApiDefinition.getPublicDetailById.method,
    url: WikiApiDefinition.getPublicDetailById.client(wikiId),
    cookie,
  });
};

/**
 * 获取知识库详情
 * @param wikiId
 * @returns
 */
export const usePublicWikiDetail = (wikiId) => {
  const { data, error } = useQuery(
    WikiApiDefinition.getPublicDetailById.client(wikiId),
    () => getPublicWikiDetail(wikiId),
    { retry: 0 }
  );
  const loading = !data && !error;
  return { data, loading, error };
};

/**
 * 获取公开知识库文档目录
 * @param workspaceId
 * @returns
 */
export const getPublicWikiTocs = (wikiId, cookie = null): Promise<Array<IDocument & { createUser: IUser }>> => {
  return HttpClient.request({
    method: WikiApiDefinition.getPublicTocsById.method,
    url: WikiApiDefinition.getPublicTocsById.client(wikiId),
    cookie,
  });
};

/**
 * 获取公开知识库文档目录
 * @param workspaceId
 * @returns
 */
export const usePublicWikiTocs = (wikiId) => {
  const { data, error, refetch } = useQuery(
    WikiApiDefinition.getPublicTocsById.client(wikiId),
    () => getPublicWikiTocs(wikiId),
    { retry: 0 }
  );
  const loading = !data && !error;

  return { data, loading, error, refresh: refetch };
};
