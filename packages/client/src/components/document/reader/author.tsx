import React from 'react';
import { Space, Avatar } from '@douyinfe/semi-ui';
import { LocaleTime } from 'components/locale-time';
import { IconUser } from '@douyinfe/semi-icons';
import { IDocument } from '@think/domains';

interface IProps {
  document: IDocument;
}

export const Author: React.FC<IProps> = ({ document }) => {
  return (
    <div
      style={{
        borderTop: '1px solid var(--semi-color-border)',
        marginTop: 24,
        padding: '16px 0',
        fontSize: 13,
        fontWeight: 'normal',
        color: 'var(--semi-color-text-0)',
      }}
    >
      <Space>
        <Avatar size="small" src={document.createUser && document.createUser.avatar}>
          <IconUser />
        </Avatar>
        <div>
          <p style={{ margin: 0 }}>
            创建者：
            {document.createUser && document.createUser.name}
          </p>
          <p style={{ margin: '8px 0 0' }}>
            最近更新日期：
            <LocaleTime date={document.updatedAt} timeago />
            {' ⦁ '}阅读量：
            {document.views}
          </p>
        </div>
      </Space>
    </div>
  );
};
