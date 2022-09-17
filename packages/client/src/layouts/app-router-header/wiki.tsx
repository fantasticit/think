import { IconChevronDown } from '@douyinfe/semi-icons';
import { Avatar, Dropdown, Modal, Space, Typography } from '@douyinfe/semi-ui';
import { DataRender } from 'components/data-render';
import { Empty } from 'components/empty';
import { WikiStar } from 'components/wiki/star';
import { useStarWikisInOrganization } from 'data/star';
import { useWikiDetail } from 'data/wiki';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import styles from './index.module.scss';
import { Placeholder } from './placeholder';

const { Text } = Typography;

const WikiContent = () => {
  const { query } = useRouter();
  const {
    data: starWikis,
    loading,
    error,
    refresh: refreshStarWikis,
  } = useStarWikisInOrganization(query.organizationId);
  const { data: currentWiki } = useWikiDetail(query.wikiId);

  const renderNormalContent = useCallback(() => {
    return (
      <div className={styles.itemsWrap}>
        {starWikis && starWikis.length ? (
          starWikis.map((wiki) => {
            return (
              <div className={styles.itemWrap} key={wiki.id}>
                <Link
                  href={{
                    pathname: '/app/org/[organizationId]/wiki/[wikiId]',
                    query: {
                      organizationId: wiki.organizationId,
                      wikiId: wiki.id,
                    },
                  }}
                >
                  <a className={styles.item}>
                    <div className={styles.leftWrap}>
                      <Avatar
                        shape="square"
                        size="small"
                        src={wiki.avatar}
                        style={{
                          marginRight: 8,
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                        }}
                      >
                        {wiki.name.charAt(0)}
                      </Avatar>
                      <div>
                        <Text ellipsis={{ showTooltip: true }} style={{ width: 180 }}>
                          {wiki.name}
                        </Text>
                      </div>
                    </div>
                    <div className={styles.rightWrap}>
                      <WikiStar organizationId={wiki.organizationId} wikiId={wiki.id} onChange={refreshStarWikis} />
                    </div>
                  </a>
                </Link>
              </div>
            );
          })
        ) : (
          <Empty message="收藏的知识库会出现在此处" />
        )}
      </div>
    );
  }, [refreshStarWikis, starWikis]);

  return (
    <>
      {currentWiki && (
        <>
          <div className={styles.titleWrap}>
            <Text strong type="secondary">
              当前
            </Text>
          </div>
          <div className={styles.itemWrap}>
            <Link
              href={{
                pathname: '/app/org/[organizationId]/wiki/[wikiId]',
                query: {
                  organizationId: currentWiki.organizationId,
                  wikiId: currentWiki.id,
                },
              }}
            >
              <a className={styles.item}>
                <div className={styles.leftWrap}>
                  <Avatar
                    shape="square"
                    size="small"
                    src={currentWiki.avatar}
                    style={{
                      marginRight: 8,
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                    }}
                  >
                    {currentWiki.name.charAt(0)}
                  </Avatar>
                  <div>
                    <Text ellipsis={{ showTooltip: true }} style={{ width: 180 }}>
                      {currentWiki.name}
                    </Text>
                  </div>
                </div>
                <div className={styles.rightWrap}>
                  <WikiStar
                    organizationId={currentWiki.organizationId}
                    wikiId={currentWiki.id}
                    onChange={refreshStarWikis}
                  />
                </div>
              </a>
            </Link>
          </div>
        </>
      )}
      <div className={styles.titleWrap}>
        <Text strong type="secondary">
          已收藏
        </Text>
      </div>
      <DataRender
        loading={loading}
        loadingContent={<Placeholder />}
        error={error}
        normalContent={renderNormalContent}
      />
      <Dropdown.Divider />
      <div className={styles.itemWrap}>
        <Link
          href={{
            pathname: '/app/org/[organizationId]/wiki',
            query: {
              organizationId: query.organizationId,
            },
          }}
        >
          <a className={styles.item} style={{ padding: '12px 16px' }}>
            <Text>查看所有知识库</Text>
          </a>
        </Link>
      </div>
    </>
  );
};

export const WikiModal = ({ visible, toggleVisible }) => {
  return (
    <Modal
      centered
      title="最近访问"
      visible={visible}
      footer={null}
      onCancel={toggleVisible}
      style={{ maxWidth: '96vw' }}
    >
      <div style={{ paddingBottom: 24 }}>
        <WikiContent />
      </div>
    </Modal>
  );
};

export const Wiki = () => {
  return (
    <Dropdown
      trigger="click"
      spacing={16}
      content={
        <div
          style={{
            width: 300,
            paddingBottom: 8,
          }}
        >
          <WikiContent />
        </div>
      }
    >
      <span>
        <Space>
          知识库
          <IconChevronDown />
        </Space>
      </span>
    </Dropdown>
  );
};
