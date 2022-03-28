import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Avatar, Button, Typography, Skeleton, Tooltip } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';
import { useWikiDetail, useWikiTocs } from 'data/wiki';
import { useToggle } from 'hooks/use-toggle';
import { Seo } from 'components/seo';
import { findParents } from 'components/wiki/tocs/utils';
import { IconDocument, IconSetting, IconOverview } from 'components/icons';
import { DocumentCreator } from 'components/document/create';
import { DataRender } from 'components/data-render';
import { EventEmitter } from 'helpers/event-emitter';
import { NavItem } from './NavItem';
import { Tree } from './tree';
import styles from './index.module.scss';
import { isPublicWiki } from '@think/domains';

const em = new EventEmitter();
const EVENT_KEY = 'REFRESH_TOCS';

export const triggerRefreshTocs = () => {
  em.emit(EVENT_KEY);
};

interface IProps {
  wikiId: string;
  documentId?: string;
  docAsLink?: string;
  getDocLink?: (arg: string) => string;
  pageTitle: string;
}

const { Text } = Typography;

export const WikiTocs: React.FC<IProps> = ({
  pageTitle,
  wikiId,
  documentId = null,
  docAsLink = '/wiki/[wikiId]/document/[documentId]',
  getDocLink = (documentId) => `/wiki/${wikiId}/document/${documentId}`,
}) => {
  const { pathname } = useRouter();
  const [visible, toggleVisible] = useToggle(false);
  const { data: wiki, loading: wikiLoading, error: wikiError } = useWikiDetail(wikiId);
  const { data: tocs, loading: tocsLoading, error: tocsError, refresh } = useWikiTocs(wikiId);
  const [parentIds, setParentIds] = useState<Array<string>>([]);

  useEffect(() => {
    if (!tocs || !tocs.length) return;
    const parentIds = findParents(tocs, documentId);
    setParentIds(parentIds);
  }, [tocs, documentId]);

  useEffect(() => {
    em.on(EVENT_KEY, () => {
      refresh();
    });

    return () => {
      em.destroy();
    };
  }, []);

  return (
    <div className={styles.wrap}>
      <DataRender
        loading={wikiLoading}
        loadingContent={
          <NavItem
            icon={
              <Skeleton.Avatar
                size="small"
                style={{
                  marginRight: 8,
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                }}
              ></Skeleton.Avatar>
            }
            text={<Skeleton.Title style={{ width: 120 }} />}
          />
        }
        error={wikiError}
        normalContent={() => (
          <>
            <Seo title={wiki.name + ' - ' + pageTitle} />
            <NavItem
              icon={
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
              }
              text={<Text strong>{wiki.name}</Text>}
              hoverable={false}
            />
          </>
        )}
      />

      <NavItem
        icon={<IconOverview />}
        text={'概述'}
        href={{
          pathname: `/wiki/[wikiId]`,
          query: { wikiId },
        }}
        isActive={pathname === '/wiki/[wikiId]'}
      />

      <NavItem
        icon={<IconSetting />}
        text={'设置'}
        href={{
          pathname: `/wiki/[wikiId]/setting`,
          query: { tab: 'base', wikiId },
        }}
        isActive={pathname === '/wiki/[wikiId]/setting'}
      />

      <DataRender
        loading={wikiLoading}
        loadingContent={
          <NavItem
            icon={
              <Skeleton.Avatar
                size="small"
                style={{
                  marginRight: 8,
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                }}
              ></Skeleton.Avatar>
            }
            text={<Skeleton.Title style={{ width: 120 }} />}
          />
        }
        error={wikiError}
        normalContent={() =>
          isPublicWiki(wiki.status) ? (
            <NavItem
              icon={<IconOverview />}
              text={
                <Tooltip content="该知识库已公开，点我查看" position="right">
                  公开地址
                </Tooltip>
              }
              href={{
                pathname: `/share/wiki/[wikiId]`,
                query: { wikiId },
              }}
              isActive={pathname === '/share/wiki/[wikiId]'}
              openNewTab
            />
          ) : null
        }
      />

      <DataRender
        loading={wikiLoading}
        loadingContent={
          <NavItem
            icon={
              <Skeleton.Avatar
                size="small"
                style={{
                  marginRight: 8,
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                }}
              ></Skeleton.Avatar>
            }
            text={<Skeleton.Title style={{ width: 120 }} />}
            rightNode={<IconPlus />}
          />
        }
        error={wikiError}
        normalContent={() => (
          <NavItem
            icon={<IconDocument />}
            text={'文档管理'}
            href={{
              pathname: `/wiki/[wikiId]/documents`,
              query: { wikiId },
            }}
            isActive={pathname === '/wiki/[wikiId]/documents'}
            rightNode={
              <>
                <Button
                  style={{ fontSize: '1em' }}
                  theme="borderless"
                  type="tertiary"
                  icon={<IconPlus style={{ fontSize: '1em' }} />}
                  size="small"
                  onClick={toggleVisible}
                />
                <DocumentCreator wikiId={wiki.id} visible={visible} toggleVisible={toggleVisible} />
              </>
            }
          />
        )}
      />

      <div className={styles.treeWrap}>
        <DataRender
          loading={tocsLoading}
          loadingContent={
            <NavItem
              icon={
                <Skeleton.Avatar
                  size="small"
                  style={{
                    marginRight: 8,
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                  }}
                ></Skeleton.Avatar>
              }
              text={<Skeleton.Title style={{ width: 120 }} />}
              rightNode={<IconPlus />}
            />
          }
          error={tocsError}
          normalContent={() => (
            <Tree
              data={tocs || []}
              docAsLink={docAsLink}
              getDocLink={getDocLink}
              parentIds={parentIds}
              activeId={documentId}
            />
          )}
        />
      </div>
    </div>
  );
};
