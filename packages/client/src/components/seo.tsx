import React, { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { RuntimeConfig } from 'hooks/use-runtime-config';

interface IProps {
  title: string;
  needTitleSuffix?: boolean;
}

export const Seo: React.FC<IProps> = ({ title, needTitleSuffix = true }) => {
  const config = RuntimeConfig.useHook();

  const buildTitle = useCallback(() => {
    return `${title} - ${config?.appName}`;
  }, [title, config?.appName]);

  useEffect(() => {
    window.document.title = needTitleSuffix ? buildTitle() : title;
  }, [title, needTitleSuffix, buildTitle]);

  return (
    <Helmet>
      <title>{needTitleSuffix ? buildTitle() : title}</title>
    </Helmet>
  );
};
