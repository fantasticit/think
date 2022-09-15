import { IconUser } from '@douyinfe/semi-icons';
import { Avatar, Space } from '@douyinfe/semi-ui';
import { IDocument } from '@think/domains';
import { LocaleTime } from 'components/locale-time';
import React from 'react';

interface IProps {
  document: IDocument;
}

const style = {
  borderTop: '1px solid var(--semi-color-border)',
  marginTop: '0.75em',
  padding: '16px 0',
  fontSize: 13,
  fontWeight: 'normal',
  color: 'var(--semi-color-text-0)',
};

export const Author: React.FC<IProps> = ({ document }) => {
  return (
    <div style={style}>
      <Space>
        <Avatar size="small" src={document && document.createUser && document.createUser.avatar}>
          <IconUser />
        </Avatar>
        <div>
          <p style={{ margin: 0 }}>
            创建者：
            {document && document.createUser && document.createUser.name}
          </p>
          <p style={{ margin: '8px 0 0' }}>
            最近更新日期：
            <LocaleTime date={document && document.updatedAt} />
            {' ⦁ '}阅读量：
            {document && document.views}
          </p>
        </div>
      </Space>
    </div>
  );
};
