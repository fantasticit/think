import { IconUpload } from '@douyinfe/semi-icons';
import { Button, Toast, Upload as SemiUpload } from '@douyinfe/semi-ui';
import { useAsyncLoading } from 'hooks/use-async-loading';
import React from 'react';
import { uploadFile } from 'services/file';

interface IProps {
  onOK: (arg: string, fileName: string, fileSize: number) => void;
  style?: React.CSSProperties;
  accept?: string;
  children?: (loading: boolean) => React.ReactNode;
}

export const Upload: React.FC<IProps> = ({ onOK, accept, style = {}, children }) => {
  const [uploadFileWithLoading, loading] = useAsyncLoading(uploadFile);

  const beforeUpload = ({ file }) => {
    uploadFileWithLoading(file.fileInstance).then((res: string) => {
      Toast.success('上传成功');
      onOK && onOK(res, file.name, file.size);
    });
    return false;
  };

  return (
    <SemiUpload
      beforeUpload={beforeUpload}
      previewFile={() => null}
      fileList={[]}
      style={{
        display: 'flex',
        justifyContent: 'center',
        ...style,
      }}
      action={''}
      accept={accept}
    >
      {(children && children(loading)) || (
        <Button icon={<IconUpload />} theme="light">
          点击上传
        </Button>
      )}
    </SemiUpload>
  );
};
