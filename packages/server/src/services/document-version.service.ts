import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getConfig } from '@think/config';
import { IDocument } from '@think/domains';
import Redis from 'ioredis';
import * as lodash from 'lodash';

type VerisonDataItem = { version: string; data: string };

@Injectable()
export class DocumentVersionService {
  private redis: Redis;
  private max = 0;
  private error: string | null = '[think] 文档版本服务启动中';

  constructor() {
    this.init();
  }

  private versionDataToArray(data: Record<string, string>): Array<VerisonDataItem> {
    return Object.keys(data)
      .sort((a, b) => +b - +a)
      .map((key) => ({ version: key, data: data[key] }));
  }

  private async init() {
    const config = getConfig();
    const redisConfig = lodash.get(config, 'db.redis', null);

    if (!redisConfig) {
      console.error('[think] Redis 未配置，无法启动文档版本服务');
      return;
    }

    this.max = lodash.get(config, 'server.maxDocumentVersion', 0) as number;

    try {
      const redis = new Redis({
        ...redisConfig,
        db: 0,
        showFriendlyErrorStack: true,
        lazyConnect: true,
      });
      redis.on('ready', () => {
        console.log('[think] 文档版本服务启动成功');
        this.redis = redis;
        this.error = null;
      });
      redis.on('error', (e) => {
        console.error(`[think] 文档版本服务启动错误: "${e}"`);
      });
      redis.connect().catch(() => {
        this.redis = null;
        this.error = '[think] 文档版本服务启动失败！';
      });
    } catch (e) {
      //
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
    const data = this.versionDataToArray(res);

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
  public async getDocumentVersions(documentId: IDocument['id']): Promise<Array<VerisonDataItem>> {
    if (this.error || !this.redis) {
      throw new HttpException(this.error, HttpStatus.NOT_IMPLEMENTED);
    }
    const res = await this.redis.hgetall(documentId);
    return res ? this.versionDataToArray(res) : [];
  }
}
