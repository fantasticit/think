import { ConfigService } from '@nestjs/config';

import { LocalOssClient } from './local.client';
import { OssClient } from './oss.client';

export { OssClient };

export const getOssClient = (configService: ConfigService): OssClient => {
  if (configService.get('oss.local.enable')) {
    return new LocalOssClient(configService);
  }

  return new LocalOssClient(configService);
};
