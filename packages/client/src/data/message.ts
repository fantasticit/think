import type { IMessage } from "@think/share";
import { useState } from "react";
import useSWR from "swr";
import { HttpClient } from "services/HttpClient";

/**
 * 所有消息
 * @returns
 */
export const useAllMessages = () => {
  const [page, setPage] = useState(1);
  const { data, error, mutate } = useSWR<{
    data: Array<IMessage>;
    total: number;
  }>(`/message/all?page=${page}`, (url) => HttpClient.get(url), {
    refreshInterval: 200,
  });
  const loading = !data && !error;

  return {
    data,
    loading,
    error,
    page,
    setPage,
  };
};

/**
 * 所有已读消息
 * @returns
 */
export const useReadMessages = () => {
  const [page, setPage] = useState(1);
  const { data, error, mutate } = useSWR<{
    data: Array<IMessage>;
    total: number;
  }>(`/message/read?page=${page}`, (url) => HttpClient.get(url), {
    refreshInterval: 200,
  });
  const loading = !data && !error;

  return {
    data,
    loading,
    error,
    page,
    setPage,
  };
};

/**
 * 所有未读消息
 * @returns
 */
export const useUnreadMessages = () => {
  const [page, setPage] = useState(1);
  const { data, error, mutate } = useSWR<{
    data: Array<IMessage>;
    total: number;
  }>(`/message/unread?page=${page}`, (url) => HttpClient.get(url), {
    refreshInterval: 200,
  });
  const loading = !data && !error;

  const readMessage = async (messageId) => {
    const ret = await HttpClient.post(`/message/read/${messageId}`);
    mutate();
    return ret;
  };

  return {
    data,
    loading,
    error,
    page,
    setPage,
    readMessage,
  };
};
