import { Skeleton } from '@douyinfe/semi-ui';

export const Placeholder = () => {
  return (
    <Skeleton
      placeholder={
        <>
          {Array.from({ length: 8 }).fill(
            <Skeleton.Title style={{ width: '100%', marginBottom: 12, marginTop: 12 }} />
          )}
        </>
      }
      loading={true}
    ></Skeleton>
  );
};
