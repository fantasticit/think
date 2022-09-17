import { Spin, Typography } from '@douyinfe/semi-ui';
import { Empty } from 'illustrations/empty';
import React, { useMemo } from 'react';

const { Text } = Typography;

export const defaultLoading = (
  <div style={{ margin: 'auto' }}>
    <Spin />
  </div>
);

export const defaultRenderError = (error) => {
  return <Text>{(error && error.message) || '未知错误'}</Text>;
};

const emptyStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  position: 'relative',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

export const defaultEmpty = (
  <div style={emptyStyle}>
    <div>
      <Empty />
    </div>
    <Text type="tertiary">暂无数据</Text>
  </div>
);

export const Render: React.FC<{ fn: ((arg: unknown) => React.ReactNode) | React.ReactNode; args?: unknown[] }> = ({
  fn,
  args = [],
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const content = useMemo(() => (typeof fn === 'function' ? fn.apply(null, ...args) : fn), [args]);

  return <>{content}</>;
};
