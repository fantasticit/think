import { Skeleton } from '@douyinfe/semi-ui';
import React from 'react';

export const DocumentSkeleton = () => {
  const placeholder = (
    <>
      <Skeleton.Title style={{ width: 240, height: '2.4em', marginBottom: 12, marginTop: 12 }} />
      <Skeleton.Paragraph style={{ width: '100%', height: 27 }} rows={7} />
    </>
  );

  return <Skeleton placeholder={placeholder} loading={true} active></Skeleton>;
};
