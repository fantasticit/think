import { Typography } from '@douyinfe/semi-ui';
import React from 'react';

interface IProps {
  illustration?: React.ReactNode;
  message: React.ReactNode;
}

const { Text } = Typography;

export const Empty: React.FC<IProps> = ({ illustration = null, message }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        margin: '16px 0',
      }}
    >
      {illustration && <main style={{ textAlign: 'center' }}>{illustration}</main>}
      <footer style={{ textAlign: 'center' }}>
        <Text type="tertiary">{message}</Text>
      </footer>
    </div>
  );
};
