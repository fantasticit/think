import { Button, Toast, Typography, Upload } from '@douyinfe/semi-ui';
import type { IWiki } from '@think/domains';
import { useCreateDocument } from 'data/document';
import { useRouterQuery } from 'hooks/use-router-query';
import { useToggle } from 'hooks/use-toggle';
import { useCallback, useEffect, useRef, useState } from 'react';

import { createMarkdownParser, MarkdownParse } from './parser';

interface IProps {
  wikiId: IWiki['id'];
}

const { Text } = Typography;

export const Import: React.FC<IProps> = ({ wikiId }) => {
  const { create } = useCreateDocument();
  const { organizationId } = useRouterQuery<{ organizationId: string }>();
  const $upload = useRef<Upload>();
  const [loading, toggleLoading] = useToggle(false);
  const [markdownParser, setMarkdownParser] = useState<MarkdownParse>();
  const [fileList, setFileList] = useState([]);

  const handleFile = useCallback(({ fileList: files }) => {
    if (!files.length) return;

    files.forEach((file) => {
      const fileName = file.fileInstance.name;

      const fileReader = new FileReader();
      fileReader.onload = function () {
        setFileList((fileList) => {
          if (fileList.find((file) => file.name === fileName)) return fileList;
          return fileList.concat({ ...file, text: fileReader.result });
        });
      };

      fileReader.readAsText(file.fileInstance);
    });

    return false;
  }, []);

  const removeFile = useCallback((currentFile) => {
    setFileList((fileList) => {
      return fileList.filter((file) => file.name !== currentFile.name);
    });
  }, []);

  const importFile = useCallback(() => {
    if (!markdownParser) return;

    const total = fileList.length;
    let success = 0;
    let failed = 0;

    toggleLoading(true);

    for (const file of fileList) {
      const payload = markdownParser.parse(file.name, file.text);
      create({ ...payload, organizationId, wikiId })
        .then(() => {
          success += 1;
        })
        .catch(() => {
          failed += 1;
        })
        .finally(() => {
          if (success + failed === total) {
            $upload.current.clear();
            toggleLoading(false);
            setFileList([]);

            if (failed > 0) {
              Toast.error('部分文件导入失败，请重新尝试导入！');
            } else {
              Toast.success('导入成功');
            }
          }
        });
    }
  }, [markdownParser, fileList, toggleLoading, create, organizationId, wikiId]);

  useEffect(() => {
    const markdownParser = createMarkdownParser();
    setMarkdownParser(markdownParser);

    return () => {
      markdownParser.destroy();
    };
  }, []);

  return (
    <div style={{ marginTop: 16 }}>
      <Upload
        action=""
        accept=".md,.MD,.Md,.mD"
        draggable
        multiple
        ref={$upload}
        beforeUpload={handleFile}
        dragMainText={<Text>点击上传文件或拖拽文件到这里</Text>}
        dragSubText={<Text type="tertiary">仅支持 Markdown 文件导入</Text>}
        onRemove={removeFile}
      />

      <Button
        onClick={importFile}
        disabled={!fileList.length}
        loading={loading}
        theme="solid"
        style={{ marginTop: 16 }}
      >
        开始导入
      </Button>
    </div>
  );
};
