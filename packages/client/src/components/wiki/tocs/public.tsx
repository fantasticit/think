import { IconPlus } from '@douyinfe/semi-icons';
import { Avatar, Skeleton, Space, Typography } from '@douyinfe/semi-ui';
import { IDocument } from '@think/domains';
import { DataRender } from 'components/data-render';
import { IconOverview } from 'components/icons';
import { LogoImage, LogoText } from 'components/logo';
import { Seo } from 'components/seo';
import { usePublicWikiDetail, usePublicWikiTocs } from 'data/wiki';
import { useRouter } from 'next/router';
import React from 'react';

import styles from './index.module.scss';
import { NavItem } from './nav-item';
import { Tree } from './tree';

interface IProps {
  wikiId: string;
  docAsLink?: string;
  getDocLink?: (arg: IDocument) => string;
  pageTitle: string;
}

const { Text } = Typography;

const defaultGetDocLink = (document) => `/share/wiki/${document.wikiId}/document/${document.id}`;

export const WikiPublicTocs: React.FC<IProps> = ({
  pageTitle,
  wikiId,
  docAsLink = '/share/wiki/[wikiId]/document/[documentId]',
  getDocLink = defaultGetDocLink,
}) => {
  const { pathname } = useRouter();
  const { data: wiki, loading: wikiLoading, error: wikiError } = usePublicWikiDetail(wikiId);
  const { data: tocs, loading: tocsLoading, error: tocsError } = usePublicWikiTocs(wikiId);

  return (
    <div className={styles.wrap}>
      <header>
        <div className={styles.navItemWrap}>
          <div className={styles.navItem}>
            <Space>
              <LogoImage /> <LogoText />
            </Space>
          </div>
        </div>

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
            pathname: `/share/wiki/[wikiId]`,
            query: { wikiId },
          }}
          isActive={pathname === '/share/wiki/[wikiId]'}
        />
      </header>

      <main>
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
            normalContent={() => <Tree data={tocs || []} docAsLink={docAsLink} getDocLink={getDocLink} isShareMode />}
          />
        </div>
      </main>
    </div>
  );
};
