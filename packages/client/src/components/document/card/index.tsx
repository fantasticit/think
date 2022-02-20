import { useCallback } from "react";
import Router from "next/router";
import Link from "next/link";
import {
  Button,
  Space,
  Typography,
  Tooltip,
  Avatar,
  Skeleton,
} from "@douyinfe/semi-ui";
import { IconEdit, IconUser } from "@douyinfe/semi-icons";
import { IDocument } from "@think/share";
import { LocaleTime } from "components/locale-time";
import { IconDocument } from "components/icons/IconDocument";
import { DocumentShare } from "components/document/share";
import { DocumentStar } from "components/document/star";
import styles from "./index.module.scss";

const { Text } = Typography;

export const DocumentCard: React.FC<{ document: IDocument }> = ({
  document,
}) => {
  const gotoEdit = useCallback(() => {
    Router.push(`/wiki/${document.wikiId}/document/${document.id}/edit`);
  }, [document]);

  return (
    <div className={styles.cardWrap}>
      <Link
        href={{
          pathname: `/wiki/[wikiId]/document/[documentId]`,
          query: { wikiId: document.wikiId, documentId: document.id },
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
                  <Button
                    type="tertiary"
                    theme="borderless"
                    icon={<IconEdit />}
                    onClick={gotoEdit}
                  />
                </Tooltip>
                <DocumentStar documentId={document.id} />
              </Space>
            </div>
          </header>
          <main>
            <div style={{ marginBottom: 12 }}>
              <Text strong>{document.title}</Text>
            </div>
            <div>
              <Text type="tertiary" size="small">
                <Space>
                  <Avatar
                    size="extra-extra-small"
                    src={document.createUser && document.createUser.avatar}
                  >
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
          <div style={{ display: "flex" }}>
            更新时间：
            <Skeleton.Paragraph rows={1} style={{ width: 100 }} />
          </div>
        </Text>
      </footer>
    </div>
  );
};
