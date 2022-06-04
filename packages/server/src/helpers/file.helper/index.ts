import { ConfigService } from '@nestjs/config';

import { AliyunOssClient } from './aliyun.client';
import { LocalOssClient } from './local.client';
import { OssClient } from './oss.client';

export { OssClient };

export const getOssClient = (configService: ConfigService): OssClient => {
  if (configService.get('oss.aliyun.enable')) {
    return new AliyunOssClient(configService);
  }

  if (configService.get('oss.local.enable')) {
    return new LocalOssClient(configService);
  }

  return new LocalOssClient(configService);
};
