import React from 'react';
import { Spin, Typography } from '@douyinfe/semi-ui';
import { Empty } from 'illustrations/empty';

type RenderProps = React.ReactNode | (() => React.ReactNode);

interface IProps {
  loading: boolean;
  error: Error | null;
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

const runRender = (fn, ...args) => (typeof fn === 'function' ? fn.apply(null, args) : fn);

export const DataRender: React.FC<IProps> = ({
  loading,
  error,
  empty,
  loadingContent = defaultLoading,
  errorContent = defaultRenderError,
  emptyContent = defaultEmpty,
  normalContent,
}) => {
  if (loading) {
    return runRender(loadingContent);
  }

  if (error) {
    return runRender(errorContent, error);
  }

  if (empty) {
    return runRender(emptyContent);
  }

  return runRender(normalContent);
};
