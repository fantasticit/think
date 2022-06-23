import { IconLink } from '@douyinfe/semi-icons';
import { Button, Dropdown, Input, Modal, Space, Toast, Typography } from '@douyinfe/semi-ui';
import { isPublicDocument } from '@think/domains';
import { useDocumentDetail } from 'data/document';
import { getDocumentShareURL } from 'helpers/url';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { useToggle } from 'hooks/use-toggle';
import { ShareIllustration } from 'illustrations/share';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface IProps {
  documentId: string;
  disabled?: boolean;
  render?: (arg: { isPublic: boolean; disabled: boolean; toggleVisible: () => void }) => React.ReactNode;
}

const { Text } = Typography;

export const DocumentShare: React.FC<IProps> = ({ documentId, disabled = false, render }) => {
  const { isMobile } = IsOnMobile.useHook();
  const ref = useRef<HTMLInputElement>();
  const [visible, toggleVisible] = useToggle(false);
  const { data, loading, toggleStatus } = useDocumentDetail(documentId, { enabled: visible });
  const [sharePassword, setSharePassword] = useState('');
  const isPublic = useMemo(() => data && isPublicDocument(data.document.status), [data]);
  const shareUrl = useMemo(() => data && getDocumentShareURL(data.document.id), [data]);

  const copyable = useMemo(
    () => ({
      onCopy: () => Toast.success({ content: '复制文本成功' }),
      successTip: '已复制',
    }),
    []
  );

  const prevent = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const viewUrl = useCallback(() => {
    window.open(shareUrl, '_blank');
  }, [shareUrl]);

  const handleOk = useCallback(() => {
    toggleStatus({ sharePassword: isPublic ? '' : sharePassword });
  }, [isPublic, sharePassword, toggleStatus]);

  const content = useMemo(
    () => (
      <div
        style={{
          maxWidth: '96vw',
          overflow: 'auto',
        }}
        onClick={prevent}
      >
        <div style={{ textAlign: 'center' }}>
          <ShareIllustration />
        </div>
        {isPublic ? (
          <Text
            ellipsis
            icon={<IconLink />}
            copyable={copyable}
            style={{
              width: 280,
            }}
          >
            {shareUrl}
          </Text>
        ) : (
          <Input
            ref={ref}
            mode="password"
            placeholder="设置访问密码"
            value={sharePassword}
            onChange={setSharePassword}
          ></Input>
        )}
        <div style={{ marginTop: 16 }}>
          <Text type="tertiary">
            {isPublic
              ? '分享开启后，该页面包含的所有内容均可访问，请谨慎开启'
              : '  分享关闭后，非协作成员将不能继续访问该页面'}
          </Text>
        </div>
        <Space style={{ width: '100%', justifyContent: 'end', margin: '12px 0' }}>
          <Button onClick={() => toggleVisible(false)}>取消</Button>
          <Button theme="solid" type={isPublic ? 'danger' : 'primary'} onClick={handleOk}>
            {isPublic ? '关闭分享' : '开启分享'}
          </Button>
          {isPublic && (
            <Button theme="solid" type="primary" onClick={viewUrl}>
              查看文档
            </Button>
          )}
        </Space>
      </div>
    ),
    [copyable, handleOk, isPublic, prevent, sharePassword, shareUrl, toggleVisible, viewUrl]
  );

  const btn = useMemo(
    () =>
      render ? (
        render({ isPublic, disabled, toggleVisible })
      ) : (
        <Button disabled={disabled} type="primary" theme="light" onClick={toggleVisible}>
          {isPublic ? '分享中' : '分享'}
        </Button>
      ),
    [disabled, isPublic, render, toggleVisible]
  );

  useEffect(() => {
    if (loading || !data) return;
    setSharePassword(data.document && data.document.sharePassword);
  }, [loading, data]);

  useEffect(() => {
    if (visible) {
      setTimeout(() => ref.current?.focus(), 100);
    }
  }, [visible]);

  return (
    <>
      {isMobile ? (
        <>
          <Modal
            centered
            title="文档分享"
            visible={visible}
            footer={null}
            onCancel={toggleVisible}
            style={{ maxWidth: '96vw' }}
            zIndex={1067}
          >
            {content}
          </Modal>
          {btn}
        </>
      ) : (
        <Dropdown
          visible={visible}
          onVisibleChange={toggleVisible}
          trigger="click"
          position="bottomRight"
          content={
            <div
              style={{
                width: 412,
                maxWidth: '96vw',
                padding: '0 24px',
              }}
            >
              {content}
            </div>
          }
        >
          {btn}
        </Dropdown>
      )}
    </>
  );
};
