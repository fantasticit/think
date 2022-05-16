import { Skeleton } from '@douyinfe/semi-ui';
import React from 'react';

export const WorkspacePlaceholder = () => {
  const placeholder = (
    <div
      style={{
        width: '100%',
        height: 196,
        padding: 16,
        border: '1px solid  #f5f5f5',
        borderRadius: 4,
      }}
    >
      <Skeleton.Paragraph rows={1} style={{ width: 60, marginBottom: 10 }} />
      <Skeleton.Title style={{ width: 120 }} />
    </div>
  );

  return <Skeleton placeholder={placeholder} loading={true} active></Skeleton>;
};
