import { IconPlus, IconSmallTriangleDown } from '@douyinfe/semi-icons';
import { Avatar, Button, Dropdown, Skeleton, Typography } from '@douyinfe/semi-ui';
import { IDocument } from '@think/domains';
import cls from 'classnames';
import { DataRender } from 'components/data-render';
import { IconOverview, IconSetting } from 'components/icons';
import { useStarDocumentsInWiki, useStarWikisInOrganization } from 'data/star';
import { useWikiDetail, useWikiTocs } from 'data/wiki';
import { triggerCreateDocument } from 'event';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import styles from './index.module.scss';
import { Tree } from './tree';

interface IProps {
  wikiId: string;
  docAsLink?: string;
  getDocLink?: (arg: IDocument) => string;
}

const { Text } = Typography;

const defaultGetDocLink = (document) =>
  `/app/org/${document.organizationId}/wiki/${document.wikiId}/doc/${document.id}`;

export const WikiTocs: React.FC<IProps> = ({
  wikiId,
  docAsLink = '/app/org/[organizationId]/wiki/[wikiId]/doc/[documentId]',
  getDocLink = defaultGetDocLink,
}) => {
  const { pathname, query } = useRouter();
  const { data: wiki, loading: wikiLoading, error: wikiError } = useWikiDetail(wikiId);
  const { data: tocs, loading: tocsLoading, error: tocsError } = useWikiTocs(wikiId);
  const { data: starWikis } = useStarWikisInOrganization(query.organizationId);
  const {
    data: starDocuments,
    loading: starDocumentsLoading,
    error: starDocumentsError,
  } = useStarDocumentsInWiki(query.organizationId, wikiId);
  const otherStarWikis = useMemo(() => (starWikis || []).filter((wiki) => wiki.id !== wikiId), [starWikis, wikiId]);

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
                              pathname: `/app/org/[organizationId]/wiki/[wikiId]`,
                              query: { organizationId: wiki.organizationId, wikiId: wiki.id },
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
                  <Text>
                    <IconSmallTriangleDown />
                  </Text>
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
                (pathname === '/app/org/[organizationId]/wiki/[wikiId]' || query.documentId === wiki.homeDocumentId) &&
                  styles.isActive
              )}
            >
              <Link
                href={{
                  pathname: `/app/org/[organizationId]/wiki/[wikiId]`,
                  query: { organizationId: wiki.organizationId, wikiId },
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
            <div
              className={cls(
                styles.linkWrap,
                pathname === '/app/org/[organizationId]/wiki/[wikiId]/setting' && styles.isActive
              )}
            >
              <Link
                href={{
                  pathname: `/app/org/[organizationId]/wiki/[wikiId]/setting`,
                  query: { organizationId: wiki.organizationId, wikiId, tab: 'base' },
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
            normalContent={() => <Tree data={starDocuments || []} docAsLink={docAsLink} getDocLink={getDocLink} />}
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
              <Tree needAddDocument data={tocs || []} docAsLink={docAsLink} getDocLink={getDocLink} />
            )}
          />
        </div>
      </main>
    </div>
  );
};
