import { RedisDBEnum } from '@constants/*';
import { buildRedis } from '@helpers/redis.helper';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { getConfig } from '@think/config';
import { IDocument, IUser } from '@think/domains';
import Redis from 'ioredis';
import * as lodash from 'lodash';

import { UserService } from './user.service';

type VerisonDataItem = { version: string; data: string; userId: IUser['id']; createUser: IUser };

@Injectable()
export class DocumentVersionService {
  private redis: Redis;
  private max = 0;
  private error: string | null = '[think] 文档版本服务启动中';

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {
    this.init();
  }

  private async withUser(data: Array<Omit<VerisonDataItem, 'createUser'>>): Promise<VerisonDataItem[]> {
    return await Promise.all(
      data
        .filter(Boolean)
        .filter((record) => record.userId)
        .map(async (record) => {
          const { userId } = record;
          const createUser = await this.userService.findById(userId);
          return { ...record, createUser };
        })
    );
  }

  private versionDataToArray(data: Record<string, string>): Array<Omit<VerisonDataItem, 'createUser'>> {
    return Object.keys(data)
      .sort((a, b) => +b - +a)
      .map((key) => {
        const str = data[key];
        try {
          const json = JSON.parse(str);
          return { version: key, ...json };
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);
  }

  private async init() {
    const config = getConfig();
    this.max = lodash.get(config, 'server.maxDocumentVersion', 0) as number;

    try {
      this.redis = await buildRedis(RedisDBEnum.documentVersion);
      console.log('[think] 文档版本服务启动成功');
      this.error = null;
    } catch (e) {
      this.error = e.message;
      console.error(`[think] 文档版本服务启动错误: "${e.message}"`);
    }
  }

  /**
   * 根据 max 删除多余缓存数据
   * @param key
   * @returns
   */
  public async checkCacheLength(documentId) {
    if (this.max <= 0) return;
    const res = await this.redis.hgetall(documentId);
    if (!res) return;
    const data = await this.versionDataToArray(res);

    while (data.length > this.max) {
      const lastVersion = data.pop().version;
      await this.redis.hdel(documentId, lastVersion);
    }
  }

  /**
   * 保存文档版本数据
   * @param documentId
   * @param data
   * @returns
   */
  public async storeDocumentVersion(arg: {
    documentId: IDocument['id'];
    data: IDocument['content'];
    userId: IUser['id'];
  }) {
    if (!this.redis) return;

    const { documentId, data, userId } = arg;
    const storeData = JSON.stringify({
      data,
      userId,
    });
    const version = '' + Date.now();
    await this.redis.hsetnx(documentId, version, storeData);
    await this.checkCacheLength(documentId);
  }

  /**
   * 获取文档版本数据
   * @param documentId
   * @returns
   */
  public async getDocumentVersions(documentId: IDocument['id']): Promise<Array<VerisonDataItem>> {
    if (this.error || !this.redis) {
      throw new HttpException(this.error, HttpStatus.NOT_IMPLEMENTED);
    }
    const res = await this.redis.hgetall(documentId);
    if (!res) return [];
    return await this.withUser(this.versionDataToArray(res));
  }
}
