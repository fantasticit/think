import type { ITemplate } from "@think/share";
import { useCallback } from "react";
import cls from "classnames";
import Router from "next/router";
import {
  Button,
  Space,
  Typography,
  Tooltip,
  Avatar,
  Skeleton,
  Modal,
} from "@douyinfe/semi-ui";
import { IconEdit, IconUser, IconPlus } from "@douyinfe/semi-icons";
import { IconDocument } from "components/icons/IconDocument";
import { TemplateReader } from "components/template/reader";
import { useUser } from "data/user";
import styles from "./index.module.scss";
import { useToggle } from "hooks/useToggle";

const { Text } = Typography;

export interface IProps {
  template: ITemplate;
  onClick?: (id: string) => void;
  getClassNames?: (id: string) => string;
  onOpenPreview?: () => void;
  onClosePreview?: () => void;
}

export const TemplateCard: React.FC<IProps> = ({
  template,
  onClick,
  getClassNames = (id) => "",
  onOpenPreview,
  onClosePreview,
}) => {
  const { user } = useUser();
  const [visible, toggleVisible] = useToggle(false);

  const gotoEdit = useCallback(() => {
    Router.push(`/template/${template.id}/`);
  }, [template]);

  return (
    <>
      <Modal
        title="模板预览"
        width={"calc(100vh - 120px)"}
        height={"calc(100vh - 120px)"}
        bodyStyle={{
          overflow: "auto",
        }}
        visible={visible}
        onCancel={() => {
          toggleVisible(false);
          onClosePreview && onClosePreview();
        }}
        footer={null}
        fullScreen
      >
        <TemplateReader key={template.id} templateId={template.id} />
      </Modal>
      <div className={cls(styles.cardWrap, getClassNames(template.id))}>
        <header>
          <IconDocument />
          <div className={styles.rightWrap}>
            {template.createUser && user && template.createUser.id === user.id && (
              <Space>
                <Tooltip key="edit" content="编辑模板" position="bottom">
                  <Button
                    type="tertiary"
                    theme="borderless"
                    icon={<IconEdit />}
                    onClick={gotoEdit}
                  />
                </Tooltip>
              </Space>
            )}
          </div>
        </header>
        <main>
          <div style={{ marginBottom: 12 }}>
            <Text strong>{template.title}</Text>
          </div>
          <div>
            <Text type="tertiary" size="small">
              <Space>
                <Avatar
                  size="extra-extra-small"
                  src={template.createUser && template.createUser.avatar}
                >
                  <IconUser />
                </Avatar>
                创建者：
                {template.createUser && template.createUser.name}
              </Space>
            </Text>
          </div>
        </main>
        <footer>
          <Text type="tertiary" size="small">
            <div style={{ display: "flex" }}>
              已使用
              {template.usageAmount}次
            </div>
          </Text>
        </footer>
        <div className={styles.actions}>
          <Button
            theme="solid"
            type="tertiary"
            onClick={() => {
              toggleVisible(true);
              onOpenPreview && onOpenPreview();
            }}
          >
            预览
          </Button>
          {onClick && (
            <Button
              type="primary"
              theme="solid"
              onClick={() => onClick && onClick(template.id)}
            >
              使用
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export const TemplateCardPlaceholder = () => {
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

export const TemplateCardEmpty = ({
  getClassNames = () => "",
  onClick = () => {},
}) => {
  return (
    <div className={cls(styles.cardWrap, getClassNames())} onClick={onClick}>
      <div
        style={{
          height: 131,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Text link style={{ textAlign: "center" }}>
            <IconPlus
              style={{
                width: 36,
                height: 36,
                fontSize: 36,
                margin: "0 auto 12px",
              }}
            />
          </Text>
          <Text>空白文档</Text>
        </div>
      </div>
    </div>
  );
};
