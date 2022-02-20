import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Transfer,
  Button,
  Banner,
  Typography,
  RadioGroup,
  Radio,
  Toast,
} from "@douyinfe/semi-ui";
import { Checkbox } from "@douyinfe/semi-ui";
import { IconClose } from "@douyinfe/semi-icons";
import { WIKI_STATUS_LIST, isPublicDocument, isPublicWiki } from "@think/share";
import { useWikiDetail, useWikiTocs } from "data/wiki";
import { buildUrl } from "helpers/url";
import { flattenTree2Array } from "components/wiki/tocs/utils";
import styles from "./index.module.scss";

const { Text, Title } = Typography;

interface IProps {
  wikiId: string;
}

export const WorkspaceDocs: React.FC<IProps> = ({ wikiId }) => {
  const {
    data: workspace,
    loading: workspaceLoading,
    toggleStatus: toggleWorkspaceStatus,
  } = useWikiDetail(wikiId);
  const { data: tocs, loading } = useWikiTocs(wikiId);
  const documents = flattenTree2Array(tocs).map((d) => {
    d.label = d.title;
    d.value = d.id;
    return d;
  });
  const [nextStatus, setNextStatus] = useState("");
  const isPublic = useMemo(
    () => workspace && isPublicWiki(workspace.status),
    [workspace]
  );
  const [publicDocumentIds, setPublicDocumentIds] = useState([]); // 公开的
  const privateDocumentIds = useMemo(() => {
    return documents
      .filter((doc) => !publicDocumentIds.includes(doc.id))
      .map((doc) => doc.id);
  }, [tocs, publicDocumentIds]);

  const submit = () => {
    const data = { nextStatus, publicDocumentIds, privateDocumentIds };
    toggleWorkspaceStatus(data).then((res) => {
      const ret = res as unknown as any & {
        documentOperateMessage?: string;
      };
      Toast.success(ret.documentOperateMessage || "操作成功");
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
          style={{ height: 52 }}
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
    if (!workspace) return;
    setNextStatus(workspace.status);
  }, [workspace]);

  useEffect(() => {
    if (!documents.length) return;
    const activeIds = documents
      .filter((doc) => isPublicDocument(doc.status))
      .map((doc) => doc.id);
    setPublicDocumentIds(activeIds);
  }, [tocs]);

  return (
    <div className={styles.wrap}>
      {isPublic && (
        <Banner
          fullMode={false}
          type="info"
          bordered
          icon={null}
          style={{ marginTop: 16 }}
          title={
            <div
              style={{ fontWeight: 600, fontSize: "14px", lineHeight: "20px" }}
            >
              当前知识库已经公开
            </div>
          }
          description={
            isPublic && (
              <div>
                您可以点击该链接进行查看：
                <Text
                  link={{
                    href: buildUrl(`/share/wiki/${wikiId}`),
                    target: "_blank",
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
        <RadioGroup
          direction="vertical"
          value={nextStatus}
          onChange={(e) => setNextStatus(e.target.value)}
        >
          {WIKI_STATUS_LIST.map((status) => {
            return <Radio value={status.value}>{status.label}</Radio>;
          })}
        </RadioGroup>
      </div>
      <div className={styles.transferWrap}>
        <Transfer
          style={{ width: "100%", marginTop: 16 }}
          dataSource={documents}
          filter={customFilter}
          value={publicDocumentIds}
          renderSelectedItem={renderSelectedItem}
          renderSourceItem={renderSourceItem}
          inputProps={{ placeholder: "搜索文档" }}
          onChange={(_, values) =>
            setPublicDocumentIds(values.map((v) => v.id))
          }
        />
      </div>
      <Button
        style={{ marginTop: 16 }}
        type="primary"
        theme="solid"
        onClick={submit}
      >
        保存
      </Button>
    </div>
  );
};
