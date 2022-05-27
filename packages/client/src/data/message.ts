import { IMessage, MessageApiDefinition } from '@think/domains';
import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { HttpClient } from 'services/http-client';

const getMessagesApi =
  (apiKey) =>
  (
    page = 1,
    cookie = null
  ): Promise<{
    data: Array<IMessage>;
    total: number;
  }> => {
    return HttpClient.request({
      method: MessageApiDefinition[apiKey].method,
      url: MessageApiDefinition[apiKey].client(),
      cookie,
      params: {
        page,
      },
    });
  };

export const useAllMessages = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useQuery(
    [MessageApiDefinition.getAll.client(), page],
    () => getMessagesApi('getAll')(page),
    { keepPreviousData: true }
  );

  return {
    data,
    loading: isLoading,
    error,
    page,
    setPage,
  };
};

export const useReadMessages = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useQuery(
    [MessageApiDefinition.getRead.client(), page],
    () => getMessagesApi('getRead')(page),
    { keepPreviousData: true }
  );

  return {
    data,
    loading: isLoading,
    error,
    page,
    setPage,
  };
};

export const useUnreadMessages = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, refetch } = useQuery(
    [MessageApiDefinition.getUnread.client(), page],
    () => getMessagesApi('getUnread')(page),
    { keepPreviousData: true, refetchInterval: 5000 }
  );

  const readMessage = useCallback(
    async (messageId) => {
      const ret = await HttpClient.request({
        method: MessageApiDefinition.readMessage.method,
        url: MessageApiDefinition.readMessage.client(messageId),
      });
      refetch();
      return ret;
    },
    [refetch]
  );

  return {
    data,
    loading: isLoading,
    error,
    readMessage,
    page,
    setPage,
  };
};
