import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import Redis from 'ioredis';
import { DocumentStatus, IDocument } from '@think/domains';
import { getConfig } from '@think/config';
import * as lodash from 'lodash';

@Injectable()
export class DocumentVersionService {
  private redis: Redis;

  constructor() {
    this.init();
  }

  private versionDataToArray(data: Record<string, string>): Array<{ version: string; data: string }> {
    return Object.keys(data)
      .sort((a, b) => +b - +a)
      .map((key) => ({ version: new Date(+key).toLocaleString(), data: data[key] }));
  }

  private async init() {
    const config = getConfig();
    const redisConfig = lodash.get(config, 'db.redis', {});

    try {
      const redis = new Redis(redisConfig);
      this.redis = redis;
    } catch (e) {
      this.redis = null;
    }
  }

  public async getDocumentVersions(documentId: IDocument['id']): Promise<Array<{ version: string; data: string }>> {
    if (!this.redis) return [];

    return new Promise((resolve, reject) => {
      this.redis.hgetall(documentId, (err, ret) => {
        if (err) {
          reject(err);
        } else {
          resolve(ret ? this.versionDataToArray(ret) : []);
        }
      });
    });
  }

  public async storeDocumentVersion(documentId: IDocument['id'], data: IDocument['content']) {
    if (!this.redis) return;
    const version = '' + Date.now();
    this.redis.hsetnx(documentId, version, data);
  }
}
