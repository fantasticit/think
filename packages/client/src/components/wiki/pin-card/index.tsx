import { Avatar, Skeleton, Space, Typography } from '@douyinfe/semi-ui';
import { IWiki } from '@think/domains';
import { IconDocument } from 'components/icons/IconDocument';
import { LocaleTime } from 'components/locale-time';
import { WikiStar } from 'components/wiki/star';
import Link from 'next/link';

import styles from './index.module.scss';

const { Text, Paragraph } = Typography;

export const WikiPinCard: React.FC<{ wiki: IWiki }> = ({ wiki }) => {
  return (
    <div className={styles.cardWrap}>
      <Link
        href={{
          pathname: `/app/org/[organizationId]/wiki/[wikiId]`,
          query: { organizationId: wiki.organizationId, wikiId: wiki.id },
        }}
      >
        <a>
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
            <div className={styles.rightWrap}>
              <Space>
                <WikiStar organizationId={wiki.organizationId} wikiId={wiki.id} />
              </Space>
            </div>
          </header>
          <main>
            <Paragraph ellipsis={{ rows: 1 }} strong>
              {wiki.name}
            </Paragraph>
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

export const WikiPinCardPlaceholder = () => {
  return (
    <div className={styles.cardWrap}>
      <a>
        <header>
          <IconDocument />
        </header>
        <main>
          <Skeleton.Title style={{ width: 160 }} />
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
