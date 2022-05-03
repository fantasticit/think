import React from 'react';
import { Spin } from '@douyinfe/semi-ui';
import { Seo } from 'components/seo';
import { DataRender } from 'components/data-render';
import { useTemplate } from 'data/template';
import { ImageViewer } from 'components/image-viewer';
import { ReaderEditor } from 'tiptap/editor';

interface IProps {
  templateId: string;
}

export const TemplateReader: React.FC<IProps> = ({ templateId }) => {
  const { data, loading, error } = useTemplate(templateId);

  return (
    <DataRender
      loading={loading}
      loadingContent={
        <div style={{ margin: 24 }}>
          <Spin></Spin>
        </div>
      }
      error={error}
      normalContent={() => {
        return (
          <div id="js-template-reader" className="container">
            <Seo title={data.title} />
            <ReaderEditor content={data.content} />
            <ImageViewer containerSelector={`#js-template-reader`} />
          </div>
        );
      }}
    />
  );
};
