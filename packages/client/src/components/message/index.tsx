import { Badge, Button, Dropdown, Modal, Pagination, TabPane, Tabs, Typography } from '@douyinfe/semi-ui';
import { DataRender } from 'components/data-render';
import { Empty } from 'components/empty';
import { IconMessage } from 'components/icons/IconMessage';
import { useAllMessages, useReadMessages, useUnreadMessages } from 'data/message';
import { useUser } from 'data/user';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { useToggle } from 'hooks/use-toggle';
import { EmptyBoxIllustration } from 'illustrations/empty-box';
import Link from 'next/link';
import React, { useCallback, useMemo } from 'react';

import styles from './index.module.scss';
import { Placeholder } from './placeholder';

const { Text } = Typography;
const PAGE_SIZE = 6;

const MessagesRender = ({ messageData, loading, error, onClick = null, page = 1, onPageChange = null }) => {
  const [messages, total] = useMemo(
    () => [(messageData && messageData.data) || [], (messageData && messageData.total) || 0],
    [messageData]
  );

  const handleRead = useCallback(
    (messageId) => {
      onClick && onClick(messageId);
    },
    [onClick]
  );

  const renderNormalContent = useCallback(() => {
    return (
      <div
        className={styles.itemsWrap}
        style={{ margin: '8px -16px', minHeight: 224 }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {messages.length ? (
          <>
            {messages.map((msg) => {
              return (
                <div key={msg.id} className={styles.itemWrap} onClick={() => handleRead(msg.id)}>
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
                  style={{ textAlign: 'center' }}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </>
        ) : (
          <Empty illustration={<EmptyBoxIllustration />} message="暂无消息" />
        )}
      </div>
    );
  }, [handleRead, messages, onPageChange, page, total]);

  return (
    <DataRender loading={loading} loadingContent={<Placeholder />} error={error} normalContent={renderNormalContent} />
  );
};

const MessageBox = () => {
  const { isMobile } = IsOnMobile.useHook();
  const [visible, toggleVisible] = useToggle(false);
  const { data: allMsgs, loading: allLoading, error: allError, page: allPage, setPage: allSetPage } = useAllMessages();
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

  const clearAll = useCallback(() => {
    Promise.all(
      (unreadMsgs.data || []).map((msg) => {
        return readMessage(msg.id);
      })
    );
  }, [readMessage, unreadMsgs]);

  const openModalOnMobile = useCallback(() => {
    if (!isMobile) return;
    toggleVisible(true);
  }, [isMobile, toggleVisible]);

  const content = useMemo(
    () =>
      visible ? (
        <Tabs
          type="line"
          size="small"
          tabBarExtraContent={
            unreadMsgs && unreadMsgs.total > 0 ? (
              <Text type="quaternary" onClick={clearAll} style={{ cursor: 'pointer' }}>
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
      ) : null,
    [
      allError,
      allLoading,
      allMsgs,
      allPage,
      allSetPage,
      clearAll,
      readError,
      readLoading,
      readMessage,
      readMsgs,
      readPage,
      readSetPage,
      unreadError,
      unreadLoading,
      unreadMsgs,
      unreadPage,
      unreadSetPage,
      visible,
    ]
  );

  const btn = (
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
      onClick={openModalOnMobile}
    />
  );

  return (
    <span>
      {isMobile ? (
        <>
          <Modal
            centered
            title="最近访问"
            visible={visible}
            footer={null}
            onCancel={toggleVisible}
            style={{ maxWidth: '96vw' }}
          >
            {content}
          </Modal>
          {btn}
        </>
      ) : (
        <Dropdown
          visible={visible}
          onVisibleChange={toggleVisible}
          position="bottomRight"
          trigger="click"
          content={<div style={{ width: 300, padding: '16px 16px 0' }}>{content}</div>}
        >
          {btn}
        </Dropdown>
      )}
    </span>
  );
};

export const Message = () => {
  const { loading, error } = useUser();

  const renderNormalContent = useCallback(() => <MessageBox />, []);

  return <DataRender loading={loading} error={error} normalContent={renderNormalContent} />;
};
