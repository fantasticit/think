/*
 * @Author: SudemQaQ
 * @Date: 2024-09-09 10:28:02
 * @email: mail@szhcloud.cn
 * @Blog: https://blog.szhcloud.cn
 * @github: https://github.com/sang8052
 * @LastEditors: SudemQaQ
 * @LastEditTime: 2024-09-10 07:46:50
 * @Description:
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RedisDBEnum } from '@constants/*';
import { getOssClient, OssClient } from '@helpers/file.helper';
import { buildRedis } from '@helpers/redis.helper';
import Redis from 'ioredis';

@Injectable()
export class FileService {
  [x: string]: any;
  private ossClient: OssClient;
  private redis: Redis;

  constructor(private readonly configService: ConfigService) {
    this.ossClient = getOssClient(this.configService);
    this.buildRedis();
  }

  private async buildRedis() {
    try {
      this.redis = await buildRedis(RedisDBEnum.view);
      console.log('[think] 文件服务启动成功');
      this.ossClient.setRedis(this.redis);
    } catch (e) {
      console.error(`[think] 文件服务启动错误: "${e.message}"`);
    }
  }

  async uploadFile(file, query) {
    return this.ossClient.uploadFile(file, query);
  }

  async initChunk(query) {
    return this.ossClient.initChunk(query);
  }

  async uploadChunk(file, query) {
    return this.ossClient.uploadChunk(file, query);
  }

  async mergeChunk(query) {
    return this.ossClient.mergeChunk(query);
  }

  async ossSign(query) {
    return this.ossClient.ossSign(query);
  }

  async ossChunk(query) {
    return this.ossClient.ossChunk(query);
  }

  async ossMerge(query) {
    return this.ossClient.ossMerge(query);
  }
}
