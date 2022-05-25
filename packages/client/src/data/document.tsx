import { DocumentApiDefinition, IAuthority, IDocument, IUser, IWiki } from '@think/domains';
import { triggerRefreshTocs } from 'event';
import { useAsyncLoading } from 'hooks/use-async-loading';
import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { HttpClient } from 'services/http-client';

type IDocumentWithVisitedAt = IDocument & { visitedAt: string };
type ICreateDocument = Partial<Pick<IDocument, 'wikiId' | 'parentDocumentId'>>;
type IDocumentWithAuth = { document: IDocument; authority: IAuthority };
type IUpdateDocument = Partial<Pick<IDocument, 'title' | 'content'>>;

/**
 * 获取用户最近访问的文档
 * @returns
 */
export const getRecentVisitedDocuments = (cookie = null): Promise<IDocumentWithVisitedAt[]> => {
  return HttpClient.request({
    method: DocumentApiDefinition.recent.method,
    url: DocumentApiDefinition.recent.client(),
    cookie,
  });
};

/**
 * 获取用户最近访问的文档
 * @returns
 */
export const useRecentDocuments = () => {
  const { data, error, isLoading, refetch } = useQuery(
    DocumentApiDefinition.recent.client(),
    getRecentVisitedDocuments,
    { staleTime: 0, refetchOnMount: true }
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
export const getDocumentMembers = (documentId, cookie = null): Promise<Array<{ user: IUser; auth: IAuthority }>> => {
  return HttpClient.request({
    method: DocumentApiDefinition.getMemberById.method,
    url: DocumentApiDefinition.getMemberById.client(documentId),
    cookie,
  });
};

/**
 * 文档成员管理
 * @param documentId
 * @returns
 */
export const useDoumentMembers = (documentId) => {
  const { data, error, isLoading, refetch } = useQuery(DocumentApiDefinition.getMemberById.client(documentId), () =>
    getDocumentMembers(documentId)
  );

  const addUser = useCallback(
    async (userName) => {
      const ret = await HttpClient.request({
        method: DocumentApiDefinition.addMemberById.method,
        url: DocumentApiDefinition.addMemberById.client(documentId),
        data: {
          documentId,
          userName,
          readable: true,
          editable: false,
        },
      });
      refetch();
      return ret;
    },
    [refetch, documentId]
  );

  const updateUser = useCallback(
    async (docAuth: DocAuth) => {
      const ret = await HttpClient.request({
        method: DocumentApiDefinition.updateMemberById.method,
        url: DocumentApiDefinition.updateMemberById.client(documentId),
        data: {
          documentId,
          ...docAuth,
        },
      });
      refetch();
      return ret;
    },
    [refetch, documentId]
  );

  const deleteUser = useCallback(
    async (docAuth: DocAuth) => {
      const ret = await HttpClient.request({
        method: DocumentApiDefinition.deleteMemberById.method,
        url: DocumentApiDefinition.deleteMemberById.client(documentId),
        data: {
          documentId,
          ...docAuth,
        },
      });
      refetch();
      return ret;
    },
    [refetch, documentId]
  );

  return { users: data, loading: isLoading, error, addUser, updateUser, deleteUser };
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
export const useDocumentDetail = (documentId) => {
  const { data, error, isLoading, refetch } = useQuery(
    DocumentApiDefinition.getDetailById.client(documentId),
    () => getDocumentDetail(documentId),
    { staleTime: 3000, refetchOnReconnect: true, refetchOnMount: true, refetchOnWindowFocus: true }
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

  return { data, loading: isLoading, error, update, toggleStatus };
};

/**
 * 获取文档版本
 * @param documentId
 * @returns
 */
export const getDocumentVersion = (documentId, cookie = null): Promise<Array<{ version: string; data: string }>> => {
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
export const useDocumentVersion = (documentId) => {
  const { data, error, isLoading, refetch } = useQuery(DocumentApiDefinition.getVersionById.client(documentId), () =>
    getDocumentVersion(documentId)
  );
  return { data: data || [], loading: isLoading, error, refresh: refetch };
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
