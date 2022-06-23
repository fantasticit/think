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
  const { data: tocs } = useWikiTocs(wikiId);

  const [nextStatus, setNextStatus] = useState('');
  const isPublic = useMemo(() => wiki && isPublicWiki(wiki.status), [wiki]);

  const documents = useMemo(
    () =>
      flattenTree2Array(tocs)
        .sort((a, b) => a.index - b.index)
        .map((d) => {
          d.label = d.title;
          d.value = d.id;
          return d;
        }),
    [tocs]
  );
  const [publicDocumentIds, setPublicDocumentIds] = useState([]); // 公开的
  const privateDocumentIds = useMemo(() => {
    return documents.filter((doc) => !publicDocumentIds.includes(doc.id)).map((doc) => doc.id);
  }, [documents, publicDocumentIds]);

  const renderSourceItem = useCallback((item) => {
    return (
      <div className={styles.sourceItem} key={item.id}>
        <Checkbox
          onChange={() => {
            item.onChange();
          }}
          key={item.label}
          checked={item.checked}
        >
          <Text>{item.title}</Text>
        </Checkbox>
      </div>
    );
  }, []);

  const renderSelectedItem = useCallback((item) => {
    return (
      <div className={styles.selectedItem} key={item.id}>
        <Text>{item.title}</Text>
        <IconClose onClick={item.onRemove} />
      </div>
    );
  }, []);

  const customFilter = useCallback((sugInput, item) => {
    return item.title.includes(sugInput);
  }, []);

  useEffect(() => {
    if (!documents.length) return;
    const activeIds = documents.filter((doc) => isPublicDocument(doc.status)).map((doc) => doc.id);
    setPublicDocumentIds(activeIds);
  }, [documents]);

  const submit = () => {
    const data = { nextStatus, publicDocumentIds, privateDocumentIds };

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

      <div
        className={styles.transferWrap}
        style={{
          height: `calc(100vh - ${isPublic ? 426 : 342}px)`,
        }}
      >
        <Transfer
          style={{ width: '100%', height: '100%' }}
          dataSource={documents}
          filter={customFilter}
          value={publicDocumentIds}
          renderSelectedItem={renderSelectedItem}
          renderSourceItem={renderSourceItem}
          inputProps={{ placeholder: '搜索文档' }}
          onChange={(_, values) => setPublicDocumentIds(values.map((v) => v.id))}
        />
      </div>

      <Button style={{ marginTop: 16 }} type="primary" theme="solid" onClick={submit}>
        保存
      </Button>
    </div>
  );
};
