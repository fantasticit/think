import { IconClose } from '@douyinfe/semi-icons';
import { Banner, Button, Checkbox, Radio, RadioGroup, Toast, Transfer, Typography } from '@douyinfe/semi-ui';
import { isPublicDocument, isPublicWiki, WIKI_STATUS_LIST } from '@think/domains';
import { flattenTree2Array } from 'components/wiki/tocs/utils';
import { useWikiDetail, useWikiTocs } from 'data/wiki';
import { buildUrl } from 'helpers/url';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './index.module.scss';

const { Text, Title } = Typography;

interface IProps {
  wikiId: string;
}

export const Privacy: React.FC<IProps> = ({ wikiId }) => {
  const { data: wiki, toggleStatus: toggleWorkspaceStatus } = useWikiDetail(wikiId);
  const [nextStatus, setNextStatus] = useState('');
  const isPublic = useMemo(() => wiki && isPublicWiki(wiki.status), [wiki]);

  const submit = () => {
    const data = { nextStatus };
    toggleWorkspaceStatus(data).then((res) => {
      const ret = res as unknown as any & {
        documentOperateMessage?: string;
      };
      Toast.success(ret.documentOperateMessage || '操作成功');
    });
  };

  useEffect(() => {
    if (!wiki) return;
    setNextStatus(wiki.status);
  }, [wiki]);

  return (
    <div className={styles.wrap}>
      {isPublic && (
        <Banner
          fullMode={false}
          type="info"
          bordered
          icon={null}
          style={{ marginTop: 16 }}
          title={<div style={{ fontWeight: 600, fontSize: '14px', lineHeight: '20px' }}>当前知识库已经公开</div>}
          description={
            isPublic && (
              <div>
                您可以点击该链接进行查看：
                <Text
                  link={{
                    href: buildUrl(`/share/wiki/${wikiId}`),
                    target: '_blank',
                  }}
                  copyable={{
                    content: buildUrl(`/share/wiki/${wikiId}`),
                  }}
                >
                  知识库
                </Text>
              </div>
            )
          }
        />
      )}
      <div className={styles.statusWrap}>
        <Title className={styles.title} heading={6}>
          是否公开知识库？
        </Title>
        <RadioGroup direction="vertical" value={nextStatus} onChange={(e) => setNextStatus(e.target.value)}>
          {WIKI_STATUS_LIST.map((status) => {
            return (
              <Radio key={status.value} value={status.value}>
                {status.label}
              </Radio>
            );
          })}
        </RadioGroup>
      </div>
      <Button style={{ marginTop: 16 }} type="primary" theme="solid" onClick={submit}>
        保存
      </Button>
    </div>
  );
};
