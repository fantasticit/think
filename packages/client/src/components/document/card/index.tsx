import { IconEdit, IconUser } from '@douyinfe/semi-icons';
import { Avatar, Button, Skeleton, Space, Tooltip, Typography } from '@douyinfe/semi-ui';
import type { IDocument } from '@think/domains';
import { DocumentShare } from 'components/document/share';
import { DocumentStar } from 'components/document/star';
import { IconDocument } from 'components/icons/IconDocument';
import { LocaleTime } from 'components/locale-time';
import Link from 'next/link';
import Router from 'next/router';
import { useCallback } from 'react';

import styles from './index.module.scss';

const { Text } = Typography;

export const DocumentCard: React.FC<{ document: IDocument }> = ({ document }) => {
  const gotoEdit = useCallback(() => {
    Router.push({
      pathname: `/app/org/[organizationId]/wiki/[wikiId]/doc/[documentId]/edit`,
      query: { organizationId: document.organizationId, wikiId: document.wikiId, documentId: document.id },
    });
  }, [document]);

  return (
    <div className={styles.cardWrap}>
      <Link
        href={{
          pathname: `/app/org/[organizationId]/wiki/[wikiId]/doc/[documentId]`,
          query: { organizationId: document.organizationId, wikiId: document.wikiId, documentId: document.id },
        }}
      >
        <a>
          <header
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <IconDocument />
            <div className={styles.rightWrap}>
              <Space>
                <DocumentShare documentId={document.id} />
                <Tooltip key="edit" content="编辑" position="bottom">
                  <Button type="tertiary" theme="borderless" icon={<IconEdit />} onClick={gotoEdit} />
                </Tooltip>
                <DocumentStar
                  organizationId={document.organizationId}
                  wikiId={document.wikiId}
                  documentId={document.id}
                />
              </Space>
            </div>
          </header>
          <main>
            <div
              style={{
                marginBottom: 12,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              <Text strong>{document.title}</Text>
            </div>
            <div>
              <Text type="tertiary" size="small">
                <Space>
                  <Avatar size="extra-extra-small" src={document.createUser && document.createUser.avatar}>
                    <IconUser />
                  </Avatar>
                  创建者：
                  {document.createUser && document.createUser.name}
                </Space>
              </Text>
            </div>
          </main>
          <footer>
            <Text type="tertiary" size="small">
              更新时间：
              <LocaleTime date={document.updatedAt} />
            </Text>
          </footer>
        </a>
      </Link>
    </div>
  );
};

export const DocumentCardPlaceholder = () => {
  return (
    <div className={styles.cardWrap}>
      <a>
        <header>
          <IconDocument />
        </header>
        <main>
          <div style={{ marginBottom: 12 }}>
            <Skeleton.Title style={{ width: 160 }} />
          </div>
          <div>
            <Text type="tertiary" size="small">
              <Space>
                <Avatar size="extra-extra-small">
                  <IconUser />
                </Avatar>
                创建者：
                <Skeleton.Paragraph rows={1} style={{ width: 100 }} />
              </Space>
            </Text>
          </div>
        </main>
        <footer>
          <Text type="tertiary" size="small">
            <div style={{ display: 'flex' }}>
              更新时间：
              <Skeleton.Paragraph rows={1} style={{ width: 100 }} />
            </div>
          </Text>
        </footer>
      </a>
    </div>
  );
};
