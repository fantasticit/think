import React from 'react';
import { Spin } from '@douyinfe/semi-ui';
import { useUser } from 'data/user';
import { Seo } from 'components/seo';
import { DataRender } from 'components/data-render';
import { useTemplate } from 'data/template';
import { Editor } from './editor';

interface IProps {
  templateId: string;
}

export const TemplateEditor: React.FC<IProps> = ({ templateId }) => {
  const { user } = useUser();
  const { data, loading, error, updateTemplate, deleteTemplate } = useTemplate(templateId);

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
          <>
            <Seo title={data.title} />
            {user && data && (
              <Editor user={user} data={data} updateTemplate={updateTemplate} deleteTemplate={deleteTemplate} />
            )}
          </>
        );
      }}
    />
  );
};
