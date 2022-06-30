import { IconPlus, IconSmallTriangleDown } from '@douyinfe/semi-icons';
import { Avatar, Button, Dropdown, Skeleton, Typography } from '@douyinfe/semi-ui';
import cls from 'classnames';
import { DataRender } from 'components/data-render';
import { IconOverview, IconSetting } from 'components/icons';
import { findParents } from 'components/wiki/tocs/utils';
import { useStarWikis, useWikiStarDocuments } from 'data/star';
import { useWikiDetail, useWikiTocs } from 'data/wiki';
import { triggerCreateDocument } from 'event';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import styles from './index.module.scss';
import { Tree } from './tree';

interface IProps {
  wikiId: string;
  documentId?: string;
  docAsLink?: string;
  getDocLink?: (arg: string) => string;
}

const { Text } = Typography;

export const WikiTocs: React.FC<IProps> = ({
  wikiId,
  documentId = null,
  docAsLink = '/wiki/[wikiId]/document/[documentId]',
  getDocLink = (documentId) => `/wiki/${wikiId}/document/${documentId}`,
}) => {
  const { pathname, query } = useRouter();
  const { data: wiki, loading: wikiLoading, error: wikiError } = useWikiDetail(wikiId);
  const { data: tocs, loading: tocsLoading, error: tocsError } = useWikiTocs(wikiId);
  const { data: starWikis } = useStarWikis();
  const {
    data: starDocuments,
    loading: starDocumentsLoading,
    error: starDocumentsError,
  } = useWikiStarDocuments(wikiId);
  const [parentIds, setParentIds] = useState<Array<string>>([]);
  const otherStarWikis = useMemo(() => (starWikis || []).filter((wiki) => wiki.id !== wikiId), [starWikis, wikiId]);

  useEffect(() => {
    if (!tocs || !tocs.length) return;
    const parentIds = findParents(tocs, documentId);
    setParentIds(parentIds);
  }, [tocs, documentId]);

  return (
    <div className={styles.wrap}>
      <header>
        <DataRender
          loading={wikiLoading}
          loadingContent={
            <div className={styles.titleWrap}>
              <Skeleton
                placeholder={
                  <div style={{ display: 'flex' }}>
                    <Skeleton.Avatar
                      size="small"
                      style={{
                        marginRight: 8,
                        width: 24,
                        height: 24,
                        borderRadius: 4,
                      }}
                    ></Skeleton.Avatar>
                    <Skeleton.Title style={{ width: 120 }} />
                  </div>
                }
                loading={true}
              />
            </div>
          }
          error={wikiError}
          normalContent={() =>
            otherStarWikis.length ? (
              <Dropdown
                trigger={'click'}
                position="bottomRight"
                render={
                  <Dropdown.Menu style={{ width: 180 }}>
                    {otherStarWikis.map((wiki) => {
                      return (
                        <Dropdown.Item key={wiki.id}>
                          <Link
                            href={{
                              pathname: `/wiki/[wikiId]`,
                              query: { wikiId: wiki.id },
                            }}
                          >
                            <a
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                              }}
                            >
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
                              <Text strong style={{ width: 120 }} ellipsis={{ showTooltip: true }}>
                                {wiki.name}
                              </Text>
                            </a>
                          </Link>
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown.Menu>
                }
              >
                <div className={styles.titleWrap}>
                  <span>
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
                    <Text strong>{wiki.name}</Text>
                  </span>
                  <IconSmallTriangleDown />
                </div>
              </Dropdown>
            ) : (
              <div className={styles.titleWrap}>
                <span>
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
                  <Text strong>{wiki.name}</Text>
                </span>
              </div>
            )
          }
        />

        <DataRender
          loading={wikiLoading}
          loadingContent={
            <div className={styles.titleWrap}>
              <Skeleton
                placeholder={
                  <div style={{ display: 'flex' }}>
                    <Skeleton.Avatar
                      size="small"
                      style={{
                        marginRight: 8,
                        width: 24,
                        height: 24,
                        borderRadius: 4,
                      }}
                    ></Skeleton.Avatar>
                    <Skeleton.Title style={{ width: 120 }} />
                  </div>
                }
                loading={true}
              />
            </div>
          }
          error={wikiError}
          normalContent={() => (
            <div
              className={cls(
                styles.linkWrap,
                (pathname === '/wiki/[wikiId]' || query.documentId === wiki.homeDocumentId) && styles.isActive
              )}
            >
              <Link
                href={{
                  pathname: `/wiki/[wikiId]`,
                  query: { wikiId },
                }}
              >
                <a>
                  <IconOverview style={{ fontSize: '1em' }} />
                  <Text>主页</Text>
                </a>
              </Link>
            </div>
          )}
        />

        <DataRender
          loading={wikiLoading}
          loadingContent={
            <div className={styles.titleWrap}>
              <Skeleton
                placeholder={
                  <div style={{ display: 'flex' }}>
                    <Skeleton.Avatar
                      size="small"
                      style={{
                        marginRight: 8,
                        width: 24,
                        height: 24,
                        borderRadius: 4,
                      }}
                    ></Skeleton.Avatar>
                    <Skeleton.Title style={{ width: 120 }} />
                  </div>
                }
                loading={true}
              />
            </div>
          }
          error={wikiError}
          normalContent={() => (
            <div className={cls(styles.linkWrap, pathname === '/wiki/[wikiId]/setting' && styles.isActive)}>
              <Link
                href={{
                  pathname: `/wiki/[wikiId]/setting`,
                  query: { tab: 'base', wikiId },
                }}
              >
                <a>
                  <IconSetting style={{ fontSize: '1em' }} />
                  <Text>设置</Text>
                </a>
              </Link>
            </div>
          )}
        />
      </header>

      <main>
        <div className={styles.treeWrap}>
          <DataRender
            loading={starDocumentsLoading}
            loadingContent={<Skeleton.Title style={{ width: '100%' }} />}
            error={starDocumentsError}
            normalContent={() => (
              <div className={styles.title}>
                <Text type="tertiary" size="small">
                  已加星标
                </Text>
              </div>
            )}
          />
          <DataRender
            loading={starDocumentsLoading}
            error={starDocumentsError}
            normalContent={() => (
              <Tree
                data={starDocuments || []}
                docAsLink={docAsLink}
                getDocLink={getDocLink}
                parentIds={parentIds}
                activeId={documentId}
              />
            )}
          />
        </div>

        <div className={styles.treeWrap}>
          <DataRender
            loading={tocsLoading}
            loadingContent={<Skeleton.Title style={{ width: '100%' }} />}
            error={wikiError}
            normalContent={() => (
              <div className={styles.title}>
                <Text type="tertiary" size="small">
                  文档集
                </Text>
                <Button
                  style={{ fontSize: '1em' }}
                  theme="borderless"
                  type="tertiary"
                  icon={<IconPlus style={{ fontSize: '1em' }} />}
                  size="small"
                  onClick={() => {
                    triggerCreateDocument({ wikiId: wiki.id, documentId: null });
                  }}
                />
              </div>
            )}
          />
          <DataRender
            loading={tocsLoading}
            error={tocsError}
            normalContent={() => (
              <Tree
                needAddDocument
                data={tocs || []}
                docAsLink={docAsLink}
                getDocLink={getDocLink}
                parentIds={parentIds}
                activeId={documentId}
              />
            )}
          />
        </div>
      </main>
    </div>
  );
};
