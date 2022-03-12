import { CollectType, IDocument, IUser, IWiki, IWikiUser } from '@think/domains';
import useSWR from 'swr';
import { HttpClient } from 'services/HttpClient';

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
export const useAllWikis = () => {
  const { data, error } = useSWR<{ data: IWiki[]; total: number }>('/wiki/list/all', (url) =>
    HttpClient.get(url)
  );

  const loading = !data && !error;
  const list = (data && data.data) || [];
  const total = (data && data.total) || 0;

  return { data: list, total, error, loading };
};

/**
 * 获取用户参与的知识库
 * @returns
 */
export const useJoinWikis = () => {
  const { data, error } = useSWR<{ data: IWiki[]; total: number }>('/wiki/list/join', (url) =>
    HttpClient.get(url)
  );

  const loading = !data && !error;
  const list = (data && data.data) || [];
  const total = (data && data.total) || 0;

  return { data: list, total, error, loading };
};

/**
 * 获取用户创建的知识库
 * @returns
 */
export const useOwnWikis = () => {
  const { data, error, mutate } = useSWR<{ data: IWiki[]; total: number }>(
    '/wiki/list/own',
    (url) => HttpClient.get(url)
  );

  const createWiki = async (data: ICreateWiki) => {
    const res = await HttpClient.post<IWiki>('/wiki/create', data);
    mutate();
    return res;
  };

  /**
   * 删除文档
   * @param id
   * @returns
   */
  const deletWiki = async (id) => {
    const res = await HttpClient.delete<IWiki>('/wiki/delete/' + id);
    mutate();
    return res;
  };

  const loading = !data && !error;
  const list = (data && data.data) || [];
  const total = (data && data.total) || 0;

  return { data: list, total, error, loading, createWiki, deletWiki };
};

/**
 * 获取知识库首页文档
 * @returns
 */
export const useWikiHomeDoc = (wikiId) => {
  const { data, error } = useSWR<IDocument>('/wiki/homedoc/' + wikiId, (url) =>
    HttpClient.get(url)
  );
  const loading = !data && !error;
  return { data, error, loading };
};

/**
 * 获取知识库文档目录
 * @param workspaceId
 * @returns
 */
export const useWikiTocs = (wikiId) => {
  const { data, error, mutate } = useSWR<Array<IDocument & { createUser: IUser }>>(
    `/wiki/tocs/${wikiId}`,
    (url) => HttpClient.get(url)
  );
  const loading = !data && !error;

  const update = async (relations: Array<{ id: string; parentDocumentId: string }>) => {
    const res = await HttpClient.post(`/wiki/tocs/${wikiId}/update`, relations);
    mutate();
    return res;
  };

  return { data, loading, error, refresh: mutate, update };
};

/**
 * 获取知识库文档
 * @param workspaceId
 * @returns
 */
export const useWikiDocs = (wikiId) => {
  const { data, error, mutate } = useSWR<Array<IDocument & { createUser: IUser }>>(
    `/wiki/docs/${wikiId}`,
    (url) => HttpClient.get(url)
  );
  const loading = !data && !error;
  return { data, loading, error, refresh: mutate };
};

/**
 * 获取知识库详情
 * @param wikiId
 * @returns
 */
export const useWikiDetail = (wikiId) => {
  const { data, error, mutate } = useSWR<IWiki>(wikiId ? `/wiki/detail/${wikiId}` : null, (url) =>
    HttpClient.get(url)
  );
  const loading = !data && !error;

  /**
   * 更新知识库
   * @param data
   * @returns
   */
  const update = async (data: IUpdateWiki) => {
    const res = await HttpClient.patch('/wiki/update/' + wikiId, data);
    mutate();
    return res;
  };

  /**
   * 公开或私有知识库
   * @param data
   * @returns
   */
  const toggleStatus = async (data) => {
    const res = await HttpClient.post('/wiki/share/' + wikiId, data);
    mutate();
    return res;
  };

  return { data, loading, error, update, toggleStatus };
};

/**
 * 知识库成员
 * @param wikiId
 * @returns
 */
export const useWikiUsers = (wikiId) => {
  const { data, error, mutate } = useSWR<IWikiUser[]>('/wiki/user/' + wikiId, (url) =>
    HttpClient.get(url)
  );
  const loading = !data && !error;

  const addUser = async (data: IWikiUserOpeateData) => {
    const ret = await HttpClient.post(`/wiki/user/${wikiId}/add`, data);
    mutate();
    return ret;
  };

  const updateUser = async (data: IWikiUserOpeateData) => {
    const ret = await HttpClient.post(`/wiki/user/${wikiId}/update`, data);
    mutate();
    return ret;
  };

  const deleteUser = async (data: IWikiUserOpeateData) => {
    const ret = await HttpClient.post(`/wiki/user/${wikiId}/delete`, data);
    mutate();
    return ret;
  };

  return {
    data,
    error,
    loading,
    refresh: mutate,
    addUser,
    updateUser,
    deleteUser,
  };
};

/**
 * 收藏知识库
 * @param wikiId
 * @returns
 */
export const useWikiStar = (wikiId) => {
  const { data, error, mutate } = useSWR<boolean>(`/collector/check/${wikiId}`, () =>
    HttpClient.post(`/collector/check`, {
      type: CollectType.wiki,
      targetId: wikiId,
    })
  );

  const toggleStar = async () => {
    await HttpClient.post('/collector/toggle/', {
      type: CollectType.wiki,
      targetId: wikiId,
    });
    mutate();
  };

  return { data, error, toggleStar };
};

/**
 * 获取用户收藏的文档
 * @returns
 */
export const useStaredWikis = () => {
  const { data, error, mutate } = useSWR<IWiki[]>(
    '/collector/wikis',
    (url) => HttpClient.post(url),
    { revalidateOnFocus: true }
  );
  const loading = !data && !error;

  return { data, error, loading, refresh: mutate };
};

/**
 * 获取公开知识库首页文档
 * @returns
 */
export const usePublicWikiHomeDoc = (wikiId) => {
  const { data, error } = useSWR<IDocument>('/wiki/public/homedoc/' + wikiId, (url) =>
    HttpClient.get(url)
  );
  const loading = !data && !error;
  return { data, error, loading };
};

/**
 * 获取知识库详情
 * @param wikiId
 * @returns
 */
export const usePublicWikiDetail = (wikiId) => {
  const { data, error, mutate } = useSWR<IWiki>(
    wikiId ? `/wiki/public/detail/${wikiId}` : null,
    (url) => HttpClient.post(url)
  );
  const loading = !data && !error;
  return { data, loading, error };
};

/**
 * 获取公开知识库文档目录
 * @param workspaceId
 * @returns
 */
export const usePublicWikiTocs = (wikiId) => {
  const { data, error, mutate } = useSWR<Array<IDocument>>(`/wiki/public/tocs/${wikiId}`, (url) =>
    HttpClient.post(url)
  );
  const loading = !data && !error;

  return { data, loading, error, refresh: mutate };
};
