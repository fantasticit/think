import { ConfigService } from '@nestjs/config';

import { AliyunOssClient } from './aliyun.client';
import { LocalOssClient } from './local.client';
import { OssClient } from './oss.client';
import { TencentOssClient } from './tencent.client';

export { OssClient };

export const getOssClient = (configService: ConfigService): OssClient => {
  if (configService.get('oss.tencent.enable')) {
    return new TencentOssClient(configService);
  }

  if (configService.get('oss.aliyun.enable')) {
    return new AliyunOssClient(configService);
  }

  return new LocalOssClient(configService);
};
