import { IconClose } from '@douyinfe/semi-icons';
import { Banner, Button, Checkbox, Toast, Transfer, Typography } from '@douyinfe/semi-ui';
import { isPublicDocument } from '@think/domains';
import { flattenTree2Array } from 'components/wiki/tocs/utils';
import { useWikiDetail, useWikiTocs } from 'data/wiki';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './index.module.scss';

const { Title, Text } = Typography;

interface IProps {
  wikiId: string;
}

export const WikiDocumentsShare: React.FC<IProps> = ({ wikiId }) => {
  const { toggleStatus: toggleWorkspaceStatus } = useWikiDetail(wikiId);
  const { data: tocs } = useWikiTocs(wikiId);
  const documents = useMemo(
    () =>
      flattenTree2Array(tocs).map((d) => {
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

  const submit = () => {
    const data = { publicDocumentIds, privateDocumentIds };
    toggleWorkspaceStatus(data).then((res) => {
      const ret = res as unknown as any & {
        documentOperateMessage?: string;
      };
      Toast.success(ret.documentOperateMessage || '操作成功');
    });
  };

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

  return (
    <div className={styles.wrap}>
      <Banner
        fullMode={false}
        type="info"
        icon={null}
        closeIcon={null}
        description={<Text>在下方进行选择以公开（或取消）文档</Text>}
      />
      <div className={styles.transferWrap}>
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
