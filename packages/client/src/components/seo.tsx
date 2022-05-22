import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

interface IProps {
  title: string;
  needTitleSuffix?: boolean;
}

const buildTitle = (title) => `${title} - 云策文档`;

export const Seo: React.FC<IProps> = ({ title, needTitleSuffix = true }) => {
  useEffect(() => {
    window.document.title = needTitleSuffix ? buildTitle(title) : title;
  }, [title, needTitleSuffix]);

  return (
    <Helmet>
      <title>{needTitleSuffix ? buildTitle(title) : title}</title>
    </Helmet>
  );
};
