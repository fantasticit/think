import React from "react";
import { Helmet } from "react-helmet";

interface IProps {
  title: string;
  needTitleSuffix?: boolean;
}

const buildTitle = (title) => `${title} - 云策文档`;

export const Seo: React.FC<IProps> = ({ title, needTitleSuffix = true }) => {
  return (
    <Helmet>
      <title>{needTitleSuffix ? buildTitle(title) : title}</title>
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1.0,viewport-fit=cover,maximum-scale=1"
      />
      <meta name="keyword" content={`云策文档 协作 文档 fantasticit`} />
      <meta name="description" content={`云策文档 协作 文档 fantasticit`} />
    </Helmet>
  );
};
