import { Spin, Typography } from '@douyinfe/semi-ui';
import { Empty } from 'illustrations/empty';
import React from 'react';

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

const { Text } = Typography;

const defaultLoading = () => {
  return <Spin />;
};

const defaultRenderError = (error) => {
  return <Text>{(error && error.message) || '未知错误'}</Text>;
};

const defaultEmpty = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        position: 'relative',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div>
        <Empty />
      </div>
      <Text type="tertiary">暂无数据</Text>
    </div>
  );
};

const runRender = (fn, ...args) => (typeof fn === 'function' ? fn(...args) : fn);

export const DataRender: React.FC<IProps> = ({
  loading,
  error,
  empty,
  loadingContent = defaultLoading,
  errorContent = defaultRenderError,
  emptyContent = defaultEmpty,
  normalContent,
}) => {
  if (error) {
    return runRender(errorContent, error);
  }

  if (empty) {
    return runRender(emptyContent);
  }

  return (
    <LoadingWrap
      loading={loading}
      runRender={runRender}
      loadingContent={loadingContent}
      normalContent={loading ? null : normalContent}
    />
  );
};
