import { IconUser } from '@douyinfe/semi-icons';
import { Avatar, Skeleton, Space, Typography } from '@douyinfe/semi-ui';
import { IconDocument } from 'components/icons/IconDocument';
import { LocaleTime } from 'components/locale-time';
import { WikiStar } from 'components/wiki/star';
import { IWikiWithIsMember } from 'data/star';
import Link from 'next/link';

import styles from './index.module.scss';

const { Text, Paragraph } = Typography;

export const WikiCard: React.FC<{ wiki: IWikiWithIsMember; shareMode?: boolean }> = ({ wiki, shareMode = false }) => {
  return (
    <div className={styles.cardWrap}>
      <Link
        href={{
          pathname: shareMode || !wiki.isMember ? '/share/wiki/[wikiId]' : `/app/org/[organizationId]/wiki/[wikiId]`,
          query: { organizationId: wiki.organizationId, wikiId: wiki.id },
        }}
      >
        <a target={shareMode ? '_blank' : '_self'}>
          <header>
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
            {!shareMode && (
              <div className={styles.rightWrap}>
                <Space>
                  <WikiStar organizationId={wiki.organizationId} wikiId={wiki.id} />
                </Space>
              </div>
            )}
          </header>
          <main>
            <div style={{ marginBottom: 12 }}>
              <Paragraph ellipsis={{ rows: 1 }} strong>
                {wiki.name}
              </Paragraph>
              <Paragraph ellipsis={{ rows: 1 }}>{wiki.description}</Paragraph>
            </div>
            <div>
              <Text type="tertiary" size="small">
                <Space>
                  <Avatar size="extra-extra-small" src={wiki.createUser && wiki.createUser.avatar}>
                    <IconUser />
                  </Avatar>
                  创建者：
                  {wiki.createUser && wiki.createUser.name}
                </Space>
              </Text>
            </div>
          </main>
          <footer>
            <Text type="tertiary" size="small">
              创建时间：
              <LocaleTime date={wiki.createdAt} />
            </Text>
          </footer>
        </a>
      </Link>
    </div>
  );
};

export const WikiCardPlaceholder = () => {
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
