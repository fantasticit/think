import Link from "next/link";
import { Space, Typography, Avatar, Skeleton } from "@douyinfe/semi-ui";
import { IWiki } from "@think/share";
import { LocaleTime } from "components/locale-time";
import { IconDocument } from "components/icons/IconDocument";
import { WikiStar } from "components/wiki/star";
import styles from "./index.module.scss";

const { Text } = Typography;

export const WikiPinCard: React.FC<{ wiki: IWiki }> = ({ wiki }) => {
  return (
    <div className={styles.cardWrap}>
      <Link href={{ pathname: `/wiki/[wikiId]`, query: { wikiId: wiki.id } }}>
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
                <WikiStar wikiId={wiki.id} />
              </Space>
            </div>
          </header>
          <main>
            <Text strong>{wiki.name}</Text>
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
            <div style={{ display: "flex" }}>
              更新时间：
              <Skeleton.Paragraph rows={1} style={{ width: 100 }} />
            </div>
          </Text>
        </footer>
      </a>
    </div>
  );
};
