import { IconLikeHeart } from '@douyinfe/semi-icons';
import { Space, Typography } from '@douyinfe/semi-ui';

import { RuntimeConfig } from 'hooks/use-runtime-config';

const { Text } = Typography;

export const Author = () => {
  const config = RuntimeConfig.useHook();

  return (
    <div style={{ padding: '16px 0', textAlign: 'center' }}>
      {config.copyrightInformation ? (
        <div dangerouslySetInnerHTML={{ __html: config.copyrightInformation }}></div>
      ) : (
        <Text>
          <Space>
            Develop by
            <Text link={{ href: 'https://github.com/fantasticit/think' }}>fantasticit</Text>
            with <IconLikeHeart style={{ color: 'red' }} />
          </Space>
        </Text>
      )}
    </div>
  );
};
