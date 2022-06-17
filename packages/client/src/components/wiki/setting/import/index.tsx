import { IconUpload } from '@douyinfe/semi-icons';
import { Button, List, Toast, Typography } from '@douyinfe/semi-ui';
import type { IWiki } from '@think/domains';
import { useCreateDocument } from 'data/document';
import { useToggle } from 'hooks/use-toggle';
import { useCallback, useRef, useState } from 'react';

import { ImportEditor } from './editor';

interface IProps {
  wikiId: IWiki['id'];
}

const { Text } = Typography;

export const Import: React.FC<IProps> = ({ wikiId }) => {
  const { create } = useCreateDocument();
  const $upload = useRef<HTMLInputElement>();
  const [uploadFiles, setUploadFiles] = useState([]);
  const [texts, setTexts] = useState<Record<string, string | ArrayBuffer>>({});
  const [payloads, setPayloads] = useState<
    Record<
      string,
      {
        title: string;
        content: string;
        state: Uint8Array;
      }
    >
  >({});
  const [parsedFiles, setParsedFiles] = useState([]);
  const [loading, toggleLoading] = useToggle(false);

  const selectFile = useCallback(() => {
    $upload.current.click();
  }, []);

  const handleFile = useCallback((e) => {
    const files = Array.from(e.target.files) as Array<File>;

    if (!files.length) return;

    files.forEach((file) => {
      const fileReader = new FileReader();
      fileReader.onload = function () {
        setTexts((texts) => {
          texts[file.name] = fileReader.result;
          return texts;
        });

        setUploadFiles((files) => {
          return files.concat(file.name);
        });
      };

      fileReader.readAsText(file);
    });
  }, []);

  const onParsedFile = useCallback((filename) => {
    return (payload) => {
      setPayloads((payloads) => {
        payloads[filename] = payload;
        setParsedFiles((files) => files.concat(filename));
        return payloads;
      });
    };
  }, []);

  const onParsedFileError = useCallback((filename) => {
    return () => {
      setUploadFiles((files) => {
        return files.filter((name) => name !== filename);
      });
      setTexts((texts) => {
        delete texts[filename];
        return texts;
      });
    };
  }, []);

  const onDeleteFile = useCallback((toDeleteFilename) => {
    return () => {
      setPayloads((payloads) => {
        const newPayloads = Object.keys(payloads).reduce((accu, filename) => {
          if (filename !== toDeleteFilename) {
            accu[filename] = payloads[filename];
          }
          return accu;
        }, {});
        setParsedFiles(Object.keys(newPayloads));
        return newPayloads;
      });
    };
  }, []);

  const importFile = useCallback(() => {
    toggleLoading(true);

    Promise.all(
      Object.keys(payloads).map((filename) => {
        return create({ ...payloads[filename], wikiId });
      })
    )
      .then(() => {
        Toast.success('文档已导入');
      })
      .finally(() => {
        toggleLoading(false);
        setTexts({});
        setUploadFiles([]);
        setPayloads({});
        setParsedFiles([]);
        $upload.current.value = '';
      });
  }, [payloads, toggleLoading, create, wikiId]);

  return (
    <div style={{ marginTop: 16 }}>
      <Button icon={<IconUpload />} theme="light" onClick={selectFile}>
        点击上传
      </Button>

      <input ref={$upload} type="file" hidden multiple accept="text/markdown" onChange={handleFile} />

      {uploadFiles.map((filename) => {
        return (
          <ImportEditor
            key={filename}
            content={texts[filename]}
            onChange={onParsedFile(filename)}
            onError={onParsedFileError(filename)}
          />
        );
      })}

      <List
        dataSource={parsedFiles}
        renderItem={(filename) => (
          <List.Item main={<div>{filename}</div>} extra={<Button onClick={onDeleteFile(filename)}>删除</Button>} />
        )}
        emptyContent={<Text type="tertiary">仅支持 Markdown 文件导入</Text>}
      />

      <Button
        onClick={importFile}
        disabled={!parsedFiles.length}
        loading={loading}
        theme="solid"
        style={{ marginTop: 16 }}
      >
        开始导入
      </Button>
    </div>
  );
};
