import type { IUser, IDocument, IWiki } from '@think/domains';
import useSWR from 'swr';
import { useState, useCallback, useEffect } from 'react';
import { useAsyncLoading } from 'hooks/use-async-loading';
import { HttpClient } from 'services/HttpClient';
import { getPublicDocumentDetail } from 'services/document';

interface IAuthority {
  id: string;
  documentId: string;
  userId: string;
  readable: boolean;
  editable: boolean;
}

type ICreateDocument = Partial<Pick<IDocument, 'wikiId' | 'parentDocumentId'>>;
type IDocumentWithAuth = { document: IDocument; authority: IAuthority };
type IUpdateDocument = Partial<Pick<IDocument, 'title' | 'content'>>;

/**
 * 创建文档
 * @returns
 */
export const useCreateDocument = () => {
  const [create, loading] = useAsyncLoading((data: ICreateDocument): Promise<IDocument> => {
    return HttpClient.post('/document/create', data);
  });
  return { create, loading };
};

/**
 * 更新文档阅读量
 * @param id
 * @returns
 */
export const updateDocumentViews = (id: string) => {
  return HttpClient.get('/document/views/' + id);
};

/**
 * 删除文档
 * @param id
 * @returns
 */
export const useDeleteDocument = (id) => {
  const [deleteDocument, loading] = useAsyncLoading((): Promise<IDocument> => {
    return HttpClient.delete('/document/delete/' + id);
  });
  return { deleteDocument, loading };
};

/**
 * 获取文档详情
 * @param documentId
 * @returns
 */
export const useDocumentDetail = (documentId, options = null) => {
  const { data, error, mutate } = useSWR<IDocumentWithAuth>(
    `/document/detail/${documentId}`,
    (url) => HttpClient.get(url),
    options
  );
  const loading = !data && !error;
  const update = async (data: IUpdateDocument) => {
    const res = await HttpClient.post('/document/update/' + documentId, data);
    mutate();
    return res;
  };

  const toggleStatus = async (data: Partial<Pick<IDocument, 'sharePassword'>>) => {
    const ret = await HttpClient.post('/document/share/' + documentId, data);
    mutate();
    return ret;
  };

  return { data, loading, error, update, toggleStatus };
};

/**
 * 获取文档历史版本
 * @param documentId
 * @returns
 */
export const useDocumentVersion = (documentId) => {
  const { data, error, mutate } = useSWR<Array<{ version: string; data: string }>>(
    `/document/version/${documentId}`,
    (url) => HttpClient.get(url),
    { errorRetryCount: 0 }
  );
  const loading = !data && !error;
  return { data: data || [], loading, error, refresh: mutate };
};

/**
 * 获取知识库最近更新的10条文档
 * @returns
 */
export const useRecentDocuments = () => {
  const { data, error, mutate } = useSWR<IDocument[]>('/document/recent', (url) => HttpClient.get(url));
  const loading = !data && !error;
  return { data, error, loading, refresh: mutate };
};

/**
 * 收藏文档
 * @param documentId
 * @returns
 */
export const useDocumentStar = (documentId) => {
  const { data, error, mutate } = useSWR<boolean>(`/collector/check/${documentId}`, () =>
    HttpClient.post(`/collector/check`, {
      type: 'document',
      targetId: documentId,
    })
  );

  const toggleStar = async () => {
    await HttpClient.post('/collector/toggle/', {
      type: 'document',
      targetId: documentId,
    });
    mutate();
  };

  return { data, error, toggleStar };
};

/**
 * 获取用户收藏的文档
 * @returns
 */
export const useStaredDocuments = () => {
  const { data, error, mutate } = useSWR<IDocument[]>('/collector/documents', (url) => HttpClient.post(url));
  const loading = !data && !error;

  return { data, error, loading, refresh: mutate };
};

/**
 * 获取公开文档
 * @param documentId
 * @returns
 */
export const usePublicDocument = (documentId: string) => {
  const [fetch] = useAsyncLoading(getPublicDocumentDetail);
  const [document, setDocument] = useState<(IDocument & { createUse: IUser; wiki: IWiki }) | null>(null);
  const [error, setError] = useState<(Error & { statusCode?: number }) | null>(null);
  const loading = !document && !error;

  const queryData = useCallback(
    (sharePassword = '') => {
      fetch(documentId, { sharePassword })
        .then((doc) => {
          setDocument(doc);
          setError(null);
        })
        .catch(setError);
    },
    [documentId, error]
  );

  useEffect(() => {
    queryData();
  }, [documentId]);

  return {
    data: document,
    loading,
    error,
    query: queryData,
  };
};

/**
 * 协作文档
 * @param documentId
 * @returns
 */
export const useCollaborationDocument = (documentId) => {
  const { data, error, mutate } = useSWR<Array<IAuthority & IUser>>(
    `/document/user/${documentId}`,
    (url) => HttpClient.get(url),
    { shouldRetryOnError: false }
  );
  const loading = !data && !error;

  const addUser = async (userName) => {
    const ret = await HttpClient.post(`/document/user/${documentId}/add`, {
      documentId,
      userName,
      readable: true,
      editable: false,
    });
    mutate();
    return ret;
  };

  const updateUser = async (docAuth) => {
    const ret = await HttpClient.post(`/document/user/${documentId}/update`, {
      documentId,
      ...docAuth,
    });
    mutate();
    return ret;
  };

  const deleteUser = async (docAuth) => {
    const ret = await HttpClient.post(`/document/user/${documentId}/delete`, {
      documentId,
      ...docAuth,
    });
    mutate();
    return ret;
  };

  return { users: data, loading, error, addUser, updateUser, deleteUser };
};

/**
 * 获取子文档
 * @param documentId
 * @param isShare 访问路径
 * @returns
 */
export const useChildrenDocument = ({ wikiId, documentId, isShare = false }) => {
  const { data, error, mutate } = useSWR<Array<IDocument>>(
    isShare ? '/document/public/children' : `/document/children`,
    wikiId || documentId ? (url) => HttpClient.post(url, { wikiId, documentId, isShare }) : null,
    { shouldRetryOnError: false }
  );
  const loading = !data && !error;

  return { data, loading, error, refresh: mutate };
};
