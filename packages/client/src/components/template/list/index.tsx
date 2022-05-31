import { List, Pagination } from '@douyinfe/semi-ui';
import { DataRender } from 'components/data-render';
import { Empty } from 'components/empty';
import { IProps as ITemplateCardProps, TemplateCard, TemplateCardPlaceholder } from 'components/template/card';
import React, { useEffect, useMemo, useState } from 'react';

const grid = {
  gutter: 16,
  xs: 24,
  sm: 12,
  md: 12,
  lg: 8,
  xl: 8,
};

interface IProps extends Omit<ITemplateCardProps, 'template'> {
  // TODO: 修复类型
  hook: any;
  firstListItem?: React.ReactNode;
  pageSize?: number;
}

export const TemplateList: React.FC<IProps> = ({
  hook,
  onClick,
  getClassNames,
  firstListItem,
  onOpenPreview,
  onClosePreview,
  pageSize = 5,
}) => {
  const { data, loading, error, refresh } = hook();
  const [page, onPageChange] = useState(1);

  const arr = useMemo(() => {
    const arr = (data && data.data) || [];
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    return arr.slice(start, end);
  }, [data, page, pageSize]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <DataRender
      loading={loading}
      loadingContent={() => (
        <List
          grid={grid}
          dataSource={[1, 2, 3]}
          renderItem={() => (
            <List.Item>
              <TemplateCardPlaceholder />
            </List.Item>
          )}
        />
      )}
      error={error}
      normalContent={() => (
        <>
          <List
            grid={grid}
            dataSource={firstListItem ? [{}, ...arr] : arr}
            renderItem={(template, idx) => {
              if (idx === 0 && firstListItem) {
                return <List.Item>{firstListItem}</List.Item>;
              }

              return (
                <List.Item>
                  <TemplateCard
                    template={template}
                    onClick={onClick}
                    getClassNames={getClassNames}
                    onOpenPreview={onOpenPreview}
                    onClosePreview={onClosePreview}
                  />
                </List.Item>
              );
            }}
            emptyContent={<Empty message={'暂无模板'} />}
          ></List>
          {data.data.length > pageSize ? (
            <Pagination
              size="small"
              style={{
                width: '100%',
                flexBasis: '100%',
                justifyContent: 'center',
              }}
              pageSize={pageSize}
              total={data.data.length}
              currentPage={page}
              onChange={(cPage) => onPageChange(cPage)}
            />
          ) : null}
        </>
      )}
    />
  );
};
