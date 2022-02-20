import React, { useMemo, useState, useEffect } from "react";
import { Button, Modal, Input, Typography, Toast } from "@douyinfe/semi-ui";
import { IconLink } from "@douyinfe/semi-icons";
import { isPublicDocument, getDocumentShareURL } from "@think/share";
import { ShareIllustration } from "illustrations/share";
import { DataRender } from "components/data-render";
import { useToggle } from "hooks/useToggle";
import { useDocumentDetail } from "data/document";

interface IProps {
  documentId: string;
  render?: (arg: {
    isPublic: boolean;
    toggleVisible: (arg: boolean) => void;
  }) => React.ReactNode;
}

const { Text } = Typography;

export const DocumentShare: React.FC<IProps> = ({ documentId, render }) => {
  const [visible, toggleVisible] = useToggle(false);
  const { data, loading, error, toggleStatus } = useDocumentDetail(documentId);
  const [sharePassword, setSharePassword] = useState("");
  const isPublic = useMemo(
    () => data && isPublicDocument(data.document.status),
    [data]
  );
  const shareUrl = useMemo(
    () => data && getDocumentShareURL(data.document.id),
    [data]
  );

  const handleOk = () => {
    toggleStatus({ sharePassword: isPublic ? "" : sharePassword });
  };

  useEffect(() => {
    if (loading || !data) return;
    setSharePassword(data.document && data.document.sharePassword);
  }, [loading, data]);

  return (
    <>
      {render ? (
        render({ isPublic, toggleVisible })
      ) : (
        <Button type="primary" theme="light" onClick={toggleVisible}>
          {isPublic ? "分享中" : "分享"}
        </Button>
      )}

      <Modal
        title={isPublic ? "关闭分享" : "开启分享"}
        okText={isPublic ? "关闭分享" : "开启分享"}
        visible={visible}
        onOk={handleOk}
        onCancel={() => toggleVisible(false)}
        maskClosable={false}
        style={{ maxWidth: "96vw" }}
      >
        <DataRender
          loading={loading}
          error={error}
          normalContent={() => {
            return (
              <div>
                <div style={{ textAlign: "center" }}>
                  <ShareIllustration />
                </div>
                {isPublic ? (
                  <Text
                    ellipsis
                    icon={<IconLink />}
                    copyable={{
                      onCopy: () => Toast.success({ content: "复制文本成功" }),
                    }}
                    style={{
                      width: 320,
                    }}
                  >
                    {shareUrl}
                  </Text>
                ) : (
                  <Input
                    autofocus
                    mode="password"
                    placeholder="设置访问密码"
                    value={sharePassword}
                    onChange={setSharePassword}
                  ></Input>
                )}
                <div style={{ marginTop: 16 }}>
                  <Text type="tertiary">
                    {isPublic
                      ? "分享开启后，该页面包含的所有内容均可访问，请谨慎开启"
                      : "  分享关闭后，其他人将不能继续访问该页面"}
                  </Text>
                </div>
              </div>
            );
          }}
        />
      </Modal>
    </>
  );
};
