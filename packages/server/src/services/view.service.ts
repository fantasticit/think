import { RedisDBEnum } from '@constants/*';
import { DocumentEntity } from '@entities/document.entity';
import { buildRedis } from '@helpers/redis.helper';
import { Injectable } from '@nestjs/common';
import { IDocument, IOrganization, IUser } from '@think/domains';
import Redis from 'ioredis';
import * as lodash from 'lodash';

@Injectable()
export class ViewService {
  private redis: Redis;

  constructor() {
    this.buildRedis();
  }

  private async buildRedis() {
    try {
      this.redis = await buildRedis(RedisDBEnum.view);
      console.log('[think] 访问记录服务启动成功');
    } catch (e) {
      console.error(`[think] 访问记录服务启动错误: "${e.message}"`);
    }
  }

  /**
   * 文档访问量统计
   * @param documentId
   * @returns
   */
  private buildDocumentViewKey(documentId: IDocument['id']) {
    return `views-${documentId}`;
  }

  /**
   * 获取文档访问量
   * @param documentId
   * @returns
   */
  private getDocumentViews(documentId): Promise<number> {
    return new Promise((resolve, reject) => {
      this.redis.get(this.buildDocumentViewKey(documentId), (err, views) => {
        if (err) {
          reject(err);
        } else {
          resolve(+views);
        }
      });
    });
  }

  /**
   * 文档访问量 +1
   * @param documentId
   */
  private async recordDocumentViews(documentId) {
    const views = await this.getDocumentViews(documentId);
    this.redis.set(this.buildDocumentViewKey(documentId), String(views + 1));
  }

  /**
   * 组织内用户访问记录
   * @param organizationId
   * @returns
   */
  private buildVisitedDocumentInOrganizationKey(organizationId) {
    return `user-activity-in-${organizationId}`;
  }

  /**
   * 记录组织内用户访问行为
   * @param user
   * @param document
   */
  private async recordUserVisitedDocumentInOrganization(user: IUser, document: DocumentEntity) {
    const { id: userId } = user;
    const { organizationId, id: documentId } = document;
    const key = this.buildVisitedDocumentInOrganizationKey(organizationId);

    const exists = await this.redis.hexists(key, userId);

    if (!exists) {
      await this.redis.hset(
        key,
        userId,
        JSON.stringify([
          {
            documentId,
            visitedAt: Date.now(),
          },
        ])
      );
    } else {
      const oldData = await this.redis.hget(key, userId);
      const visitedDocuments = (JSON.parse(oldData || '[]') || []).filter((record) => record.documentId !== documentId);
      await this.redis.hset(
        key,
        userId,
        JSON.stringify(
          lodash.uniqBy(
            [
              {
                documentId,
                visitedAt: Date.now(),
              },
              ...visitedDocuments,
            ],
            (record) => record.documentId
          )
        )
      );
    }
  }

  /**
   * 删除被删除文档的访问记录
   * @param user
   * @param organizationId
   * @param documentId
   */
  public async deleteDeletedDocumentView(
    user: IUser,
    organizationId: IOrganization['id'],
    documentId: IDocument['id']
  ) {
    const { id: userId } = user;
    const key = this.buildVisitedDocumentInOrganizationKey(organizationId);
    const oldData = await this.redis.hget(key, userId);

    const filterData = (JSON.parse(oldData || '[]') || []).filter((record) => record.documentId !== documentId);
    await this.redis.hset(key, userId, JSON.stringify(filterData));
  }

  /**
   * 创建访问记录（内部调用，无公开接口）
   * @returns
   */
  async create(user: IUser | null, document: DocumentEntity) {
    await Promise.all([
      this.recordDocumentViews(document.id),
      user && this.recordUserVisitedDocumentInOrganization(user, document),
    ]);
  }

  public async getDocumentTotalViews(documentId) {
    return await this.getDocumentViews(documentId);
  }

  public async getUserRecentVisitedDocuments(
    userId: IUser['id'],
    organizationId: IOrganization['id']
  ): Promise<
    Array<{
      documentId: IDocument['id'];
      visitedAt: Date;
    }>
  > {
    const key = this.buildVisitedDocumentInOrganizationKey(organizationId);
    const exists = await this.redis.hexists(key, userId);
    let res = [];

    if (exists) {
      const oldData = await this.redis.hget(key, userId);
      res = JSON.parse(oldData);
    }

    return res;
  }
}
