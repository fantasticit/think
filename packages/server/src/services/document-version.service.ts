import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import Redis from 'ioredis';
import { IDocument } from '@think/domains';
import { getConfig } from '@think/config';
import * as lodash from 'lodash';

@Injectable()
export class DocumentVersionService {
  private redis: Redis;
  private max: number = 0;
  private error: string | null = '文档版本服务启动中';

  constructor() {
    this.init();
  }

  private versionDataToArray(
    data: Record<string, string>
  ): Array<{ originVerison: string; version: string; data: string }> {
    return Object.keys(data)
      .sort((a, b) => +b - +a)
      .map((key) => ({ originVerison: key, version: new Date(+key).toLocaleString(), data: data[key] }));
  }

  private async init() {
    const config = getConfig();
    const redisConfig = lodash.get(config, 'db.redis', null);

    if (!redisConfig) {
      console.error('Redis 未配置，无法启动文档版本服务');
      return;
    }

    this.max = lodash.get(config, 'server.maxDocumentVersion', 0);

    try {
      const redis = new Redis({
        ...redisConfig,
        db: 0,
        showFriendlyErrorStack: true,
        lazyConnect: true,
      });
      redis.on('ready', () => {
        console.log('文档版本服务启动成功');
        this.redis = redis;
        this.error = null;
      });
      redis.on('error', (e) => {
        console.error(`Redis 启动失败: "${e}"`);
      });
      redis.connect().catch((e) => {
        this.redis = null;
        this.error = 'Redis 启动失败：无法提供文档版本服务';
      });
    } catch (e) {}
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
    const data = this.versionDataToArray(res);

    while (data.length > this.max) {
      const lastVersion = data.pop().originVerison;
      await this.redis.hdel(documentId, lastVersion);
    }
  }

  /**
   * 保存文档版本数据
   * @param documentId
   * @param data
   * @returns
   */
  public async storeDocumentVersion(documentId: IDocument['id'], data: IDocument['content']) {
    if (!this.redis) return;
    const version = '' + Date.now();
    await this.redis.hsetnx(documentId, version, data);
    await this.checkCacheLength(documentId);
  }

  /**
   * 获取文档版本数据
   * @param documentId
   * @returns
   */
  public async getDocumentVersions(documentId: IDocument['id']): Promise<Array<{ version: string; data: string }>> {
    if (this.error || !this.redis) {
      throw new HttpException(this.error, HttpStatus.NOT_IMPLEMENTED);
    }
    const res = await this.redis.hgetall(documentId);
    return res ? this.versionDataToArray(res) : [];
  }
}
