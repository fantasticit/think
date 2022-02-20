import React from "react";
import { Spin } from "@douyinfe/semi-ui";
import { useUser } from "data/user";
import { Seo } from "components/seo";
import { DataRender } from "components/data-render";
import { useTemplate } from "data/template";
import { Editor } from "./editor";

interface IProps {
  templateId: string;
}

export const TemplateReader: React.FC<IProps> = ({ templateId }) => {
  const { user } = useUser();
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
          <div style={{ fontSize: 16 }}>
            <Seo title={data.title} />
            <Editor user={user} data={data} loading={loading} error={error} />
          </div>
        );
      }}
    />
  );
};
