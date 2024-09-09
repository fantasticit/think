import { ConfigService } from '@nestjs/config';

import { LocalOssClient } from './local.client';
import { OssClient } from './oss.client';
import { S3OssClient } from './s3.client';

export { OssClient };

export const getOssClient = (configService: ConfigService): OssClient => {
  if (configService.get('oss.s3.enable')) {
    return new S3OssClient(configService);
  }

  return new LocalOssClient(configService);
};
