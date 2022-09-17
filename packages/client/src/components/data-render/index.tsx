import deepEqual from 'deep-equal';
import React from 'react';

import { defaultEmpty, defaultLoading, defaultRenderError, Render } from './constant';
import { LoadingWrap } from './loading';

type RenderProps = React.ReactNode | (() => React.ReactNode);

interface IProps {
  loading: boolean;
  error: Error | null | unknown;
  empty?: boolean;
  loadingContent?: RenderProps;
  errorContent?: RenderProps;
  emptyContent?: RenderProps;
  normalContent: RenderProps;
}

export const _DataRender: React.FC<IProps> = ({
  loading,
  error,
  empty,
  loadingContent = defaultLoading,
  errorContent = defaultRenderError,
  emptyContent = defaultEmpty,
  normalContent,
}) => {
  if (error) {
    return <Render fn={errorContent} args={[error]} />;
  }

  if (empty) {
    return <Render fn={emptyContent} />;
  }

  return (
    <LoadingWrap loading={loading} loadingContent={loadingContent} normalContent={loading ? null : normalContent} />
  );
};

export const DataRender = React.memo(_DataRender, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});
