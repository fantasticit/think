import { DocumentApiDefinition, IAuthority, IDocument, IUser, IWiki } from '@think/domains';
import { triggerRefreshTocs } from 'event';
import { useAsyncLoading } from 'hooks/use-async-loading';
import { useCallback, useState } from 'react';
import { QueriesOptions, useQuery, UseQueryOptions } from 'react-query';
import { HttpClient } from 'services/http-client';

type IDocumentWithVisitedAt = IDocument & { visitedAt: string };
type ICreateDocument = Partial<Pick<IDocument, 'organizationId' | 'wikiId' | 'parentDocumentId'>>;
type IDocumentWithAuth = { document: IDocument; authority: IAuthority };
type IUpdateDocument = Partial<Pick<IDocument, 'title' | 'content'>>;

/**
 * 搜索组织内文档
 * @returns
 */
export const useSearchDocuments = (organizationId) => {
  const [apiWithLoading, loading] = useAsyncLoading((keyword) =>
    HttpClient.request({
      method: DocumentApiDefinition.search.method,
      url: DocumentApiDefinition.search.client(organizationId),
      params: { keyword },
    })
  );

  return {
    search: apiWithLoading,
    loading,
  };
};

/**
 * 获取用户最近访问的文档
 * @returns
 */
export const getRecentVisitedDocuments = (organizationId, cookie = null): Promise<IDocumentWithVisitedAt[]> => {
  return HttpClient.request({
    method: DocumentApiDefinition.recent.method,
    url: DocumentApiDefinition.recent.client(organizationId),
    cookie,
  });
};

/**
 * 获取用户最近访问的文档
 * @returns
 */
export const useRecentDocuments = (organizationId) => {
  const { data, error, isLoading, refetch } = useQuery(
    DocumentApiDefinition.recent.client(organizationId),
    () => getRecentVisitedDocuments(organizationId),
    { refetchOnWindowFocus: false, enabled: false }
  );
  return { data, error, loading: isLoading, refresh: refetch };
};

export type DocAuth = {
  userName: string;
  readable?: boolean;
  editable?: boolean;
};

/**
 * 获取文档成员
 * @param cookie
 * @returns
 */
export const getDocumentMembers = (
  documentId,
  page,
  pageSize,
  cookie = null
): Promise<Array<{ user: IUser; auth: IAuthority }>> => {
  return HttpClient.request({
    method: DocumentApiDefinition.getMemberById.method,
    url: DocumentApiDefinition.getMemberById.client(documentId),
    cookie,
    params: {
      page,
      pageSize,
    },
  });
};

/**
 * 文档成员管理
 * @param documentId
 * @returns
 */
export const useDoumentMembers = (documentId, options?: UseQueryOptions<Array<{ user: IUser; auth: IAuthority }>>) => {
  const [pageSize] = useState(12);
  const [page, setPage] = useState(1);
  const { data, error, isLoading, refetch } = useQuery(
    [DocumentApiDefinition.getMemberById.client(documentId), page],
    () => getDocumentMembers(documentId, page, pageSize),
    options
  );

  const addUser = useCallback(
    async (data) => {
      const ret = await HttpClient.request({
        method: DocumentApiDefinition.addMemberById.method,
        url: DocumentApiDefinition.addMemberById.client(documentId),
        data,
      });
      refetch();
      return ret;
    },
    [refetch, documentId]
  );

  const updateUser = useCallback(
    async (data) => {
      const ret = await HttpClient.request({
        method: DocumentApiDefinition.updateMemberById.method,
        url: DocumentApiDefinition.updateMemberById.client(documentId),
        data,
      });
      refetch();
      return ret;
    },
    [refetch, documentId]
  );

  const deleteUser = useCallback(
    async (data) => {
      const ret = await HttpClient.request({
        method: DocumentApiDefinition.deleteMemberById.method,
        url: DocumentApiDefinition.deleteMemberById.client(documentId),
        data,
      });
      refetch();
      return ret;
    },
    [refetch, documentId]
  );

  return { data, loading: isLoading, error, page, pageSize, setPage, addUser, updateUser, deleteUser };
};

/**
 * 获取文档详情
 * @param documentId
 * @returns
 */
export const getDocumentDetail = (documentId, cookie = null): Promise<IDocumentWithAuth> => {
  return HttpClient.request({
    method: DocumentApiDefinition.getDetailById.method,
    url: DocumentApiDefinition.getDetailById.client(documentId),
    cookie,
  });
};

/**
 * 获取文档详情
 * @param documentId
 * @returns
 */
export const useDocumentDetail = (documentId, options: UseQueryOptions<IDocumentWithAuth> = {}) => {
  const { data, error, isLoading, refetch } = useQuery(
    DocumentApiDefinition.getDetailById.client(documentId),
    () => getDocumentDetail(documentId),
    { ...options, staleTime: 3000 }
  );

  /**
   * 更新文档
   * @param data
   * @returns
   */
  const update = useCallback(
    async (data: IUpdateDocument) => {
      const res = await HttpClient.request({
        method: DocumentApiDefinition.updateById.method,
        url: DocumentApiDefinition.updateById.client(documentId),
        data,
      });
      refetch();
      return res;
    },
    [refetch, documentId]
  );

  /**
   * 公开或私有文档
   * @param data
   * @returns
   */
  const toggleStatus = useCallback(
    async (data) => {
      const res = await HttpClient.request({
        method: DocumentApiDefinition.shareById.method,
        url: DocumentApiDefinition.shareById.client(documentId),
        data,
      });
      refetch();
      return res;
    },
    [refetch, documentId]
  );

  /**
   * 导出文档
   */
  const exportDocx = useCallback(async (content) => {
    const res = await HttpClient.request({
      method: DocumentApiDefinition.exportDocx.method,
      url: DocumentApiDefinition.exportDocx.client(),
      data: { content },
    });
    return res;
  }, []);

  return { data, loading: isLoading, error, update, toggleStatus, exportDocx };
};

/**
 * 获取文档版本
 * @param documentId
 * @returns
 */
export const getDocumentVersion = (
  documentId,
  cookie = null
): Promise<Array<{ version: string; data: string; createUser: IUser }>> => {
  return HttpClient.request({
    method: DocumentApiDefinition.getVersionById.method,
    url: DocumentApiDefinition.getVersionById.client(documentId),
    cookie,
  });
};

/**
 * 获取文档历史版本
 * @param documentId
 * @returns
 */
export const useDocumentVersion = (
  documentId,
  options: UseQueryOptions<Array<{ version: string; data: string; createUser: IUser }>> = {}
) => {
  const { data, error, isLoading, refetch } = useQuery(
    DocumentApiDefinition.getVersionById.client(documentId),
    () => getDocumentVersion(documentId),
    options
  );
  return { data: data || [], loading: isLoading, error, refresh: () => refetch() };
};

/**
 * 删除文档
 * @param id
 * @returns
 */
export const useDeleteDocument = (documentId) => {
  const [deleteDocument, loading] = useAsyncLoading((): Promise<IDocument> => {
    return HttpClient.request({
      method: DocumentApiDefinition.deleteById.method,
      url: DocumentApiDefinition.deleteById.client(documentId),
    }).then((res) => {
      triggerRefreshTocs();
      return res as unknown as IDocument;
    });
  });
  return { deleteDocument, loading };
};

/**
 * 创建文档
 * @returns
 */
export const useCreateDocument = () => {
  const [create, loading] = useAsyncLoading((data: ICreateDocument): Promise<IDocument> => {
    return HttpClient.request({
      method: DocumentApiDefinition.create.method,
      url: DocumentApiDefinition.create.client(),
      data,
    }).then((res) => {
      triggerRefreshTocs();
      return res as unknown as IDocument;
    });
  });
  return { create, loading };
};

/**
 * 获取公开文档详情
 * @param documentId
 * @returns
 */
export const getPublicDocumentDetail = (
  documentId,
  data,
  cookie = null
): Promise<IDocument & { createUse: IUser; wiki: IWiki }> => {
  return HttpClient.request({
    method: DocumentApiDefinition.getPublicDetailById.method,
    url: DocumentApiDefinition.getPublicDetailById.client(documentId),
    cookie,
    data,
  });
};

/**
 * 获取公开文档详情
 * @param documentId
 * @returns
 */
export const usePublicDocumentDetail = (documentId) => {
  const [sharePassword, setSharePassword] = useState();
  const { data, error, isLoading, refetch } = useQuery(
    DocumentApiDefinition.getPublicDetailById.client(documentId),
    () => getPublicDocumentDetail(documentId, { sharePassword }),
    { retry: 0, refetchOnWindowFocus: true, refetchOnReconnect: false, staleTime: 3000 }
  );

  const query = useCallback(
    (password) => {
      setSharePassword(password);
      refetch();
    },
    [refetch]
  );

  return {
    data,
    loading: isLoading,
    error,
    query,
  };
};

export const getDocumentChildren = (data, cookie = null): Promise<Array<IDocument>> => {
  return HttpClient.request({
    method: data.isShare ? DocumentApiDefinition.getPublicChildren.method : DocumentApiDefinition.getChildren.method,
    url: data.isShare ? DocumentApiDefinition.getPublicChildren.client() : DocumentApiDefinition.getChildren.client(),
    cookie,
    data,
  });
};

/**
 * 获取子文档
 * @param documentId
 * @param isShare 访问路径
 * @returns
 */
export const useChildrenDocument = ({ wikiId, documentId, isShare = false }) => {
  const { data, error, refetch } = useQuery(
    [
      isShare ? DocumentApiDefinition.getPublicChildren.client() : DocumentApiDefinition.getChildren.client(),
      wikiId,
      documentId,
    ],
    () => getDocumentChildren({ wikiId, documentId, isShare })
  );
  const loading = !data && !error;

  return { data, loading, error, refresh: refetch };
};
