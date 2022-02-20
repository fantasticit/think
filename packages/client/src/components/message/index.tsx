import React, { useEffect } from "react";
import Link from "next/link";
import {
  Typography,
  Dropdown,
  Badge,
  Button,
  Tabs,
  TabPane,
  Pagination,
  Notification,
} from "@douyinfe/semi-ui";
import { IconMessage } from "components/icons/IconMessage";
import {
  useAllMessages,
  useReadMessages,
  useUnreadMessages,
} from "data/message";
import { EmptyBoxIllustration } from "illustrations/empty-box";
import { DataRender } from "components/data-render";
import { Empty } from "components/empty";
import { Placeholder } from "./Placeholder";
import styles from "./index.module.scss";

const { Text } = Typography;
const PAGE_SIZE = 6;

const MessagesRender = ({
  messageData,
  loading,
  error,
  onClick = null,
  page = 1,
  onPageChange = null,
}) => {
  const total = (messageData && messageData.total) || 0;
  const messages = (messageData && messageData.data) || [];

  const handleRead = (messageId) => {
    onClick && onClick(messageId);
  };

  return (
    <DataRender
      loading={loading}
      loadingContent={<Placeholder />}
      error={error}
      normalContent={() => {
        return (
          <div
            className={styles.itemsWrap}
            style={{ margin: "8px -16px" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {messages.length ? (
              <>
                {messages.map((msg) => {
                  return (
                    <div
                      className={styles.itemWrap}
                      onClick={() => handleRead(msg.id)}
                    >
                      <Link href={msg.url}>
                        <a className={styles.item}>
                          <div className={styles.leftWrap}>
                            <Text
                              ellipsis={{
                                showTooltip: {
                                  opts: { content: msg.message },
                                },
                              }}
                              style={{ width: 240 }}
                            >
                              {msg.title}
                            </Text>
                          </div>
                        </a>
                      </Link>
                    </div>
                  );
                })}
                {total > PAGE_SIZE && (
                  <div className={styles.paginationWrap}>
                    <Pagination
                      size="small"
                      total={total}
                      currentPage={page}
                      pageSize={PAGE_SIZE}
                      style={{ textAlign: "center" }}
                      onPageChange={onPageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <Empty
                illustration={<EmptyBoxIllustration />}
                message="暂无消息"
              />
            )}
          </div>
        );
      }}
    />
  );
};

export const Message = () => {
  const {
    data: allMsgs,
    loading: allLoading,
    error: allError,
    page: allPage,
    setPage: allSetPage,
  } = useAllMessages();
  const {
    data: readMsgs,
    loading: readLoading,
    error: readError,
    page: readPage,
    setPage: readSetPage,
  } = useReadMessages();
  const {
    data: unreadMsgs,
    loading: unreadLoading,
    error: unreadError,
    readMessage,
    page: unreadPage,
    setPage: unreadSetPage,
  } = useUnreadMessages();

  const clearAll = () => {
    Promise.all(
      (unreadMsgs.data || []).map((msg) => {
        return readMessage(msg.id);
      })
    );
  };

  useEffect(() => {
    if (!unreadMsgs || !unreadMsgs.total) return;

    const msg = unreadMsgs.data[0];

    Notification.info({
      title: "消息通知",
      content: (
        <Link href={msg.url}>
          <a className={styles.item}>
            <div className={styles.leftWrap}>
              <Text
                ellipsis={{
                  showTooltip: {
                    opts: { content: msg.message },
                  },
                }}
                style={{ width: 240 }}
              >
                {msg.title}
              </Text>
            </div>
          </a>
        </Link>
      ),

      duration: 3,
    });
  }, [unreadMsgs]);

  return (
    <Dropdown
      position="bottomRight"
      trigger="click"
      content={
        <div style={{ width: 300, padding: "16px 16px 0" }}>
          <Tabs
            type="line"
            size="small"
            tabBarExtraContent={
              unreadMsgs && unreadMsgs.total > 0 ? (
                <Text
                  type="quaternary"
                  onClick={clearAll}
                  style={{ cursor: "pointer" }}
                >
                  全部已读
                </Text>
              ) : null
            }
          >
            <TabPane tab="未读" itemKey="unread">
              <MessagesRender
                messageData={unreadMsgs}
                loading={unreadLoading}
                error={unreadError}
                onClick={readMessage}
                page={unreadPage}
                onPageChange={unreadSetPage}
              />
            </TabPane>
            <TabPane tab="已读" itemKey="read">
              <MessagesRender
                messageData={readMsgs}
                loading={readLoading}
                error={readError}
                page={readPage}
                onPageChange={readSetPage}
              />
            </TabPane>
            <TabPane tab="全部" itemKey="all">
              <MessagesRender
                messageData={allMsgs}
                loading={allLoading}
                error={allError}
                page={allPage}
                onPageChange={allSetPage}
              />
            </TabPane>
          </Tabs>
        </div>
      }
    >
      <Button
        type="tertiary"
        theme="borderless"
        icon={
          unreadMsgs && unreadMsgs.total > 0 ? (
            <Badge count={unreadMsgs.total} overflowCount={99} type="danger">
              <IconMessage style={{ transform: `translateY(2px)` }} />
            </Badge>
          ) : (
            <IconMessage />
          )
        }
      ></Button>
    </Dropdown>
  );
};
