import { IconLink } from '@douyinfe/semi-icons';
import { Button, Input, Popover, Space, Toast, Typography } from '@douyinfe/semi-ui';
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
  render?: (arg: { isPublic: boolean; disabled: boolean; toggleVisible: (arg: boolean) => void }) => React.ReactNode;
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
    <Popover
      showArrow
      visible={visible}
      onVisibleChange={toggleVisible}
      trigger="click"
      position={isMobile ? 'top' : 'bottomLeft'}
      style={{ width: 376, maxWidth: '80vw' }}
      content={
        <div
          style={{
            maxHeight: '70vh',
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
                width: 240,
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
                : '  分享关闭后，其他人将不能继续访问该页面'}
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
      }
    >
      {render ? (
        render({ isPublic, disabled, toggleVisible })
      ) : (
        <Button disabled={disabled} type="primary" theme="light" onClick={toggleVisible}>
          {isPublic ? '分享中' : '分享'}
        </Button>
      )}
    </Popover>
  );
};
