import { ViewEntity } from '@entities/view.entity';
import { convertDateToMysqlTimestamp } from '@helpers/date.helper';
import { ONE_DAY } from '@helpers/log.helper';
import { parseUserAgent } from '@helpers/ua.helper';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IDocument, IPagination, IUser } from '@think/domains';
import { Repository } from 'typeorm';

@Injectable()
export class ViewService {
  constructor(
    @InjectRepository(ViewEntity)
    private readonly viewRepo: Repository<ViewEntity>
  ) {}

  /**
   * 创建访问记录（内部调用，无公开接口）
   * @returns
   */
  async create({ userId = 'public', documentId, userAgent }) {
    const data = await this.viewRepo.create({
      userId,
      documentId,
      originUserAgent: userAgent,
      parsedUserAgent: parseUserAgent(userAgent).text,
    });
    const ret = await this.viewRepo.save(data);
    return ret;
  }

  async deleteViews(documentId) {
    const records = await this.viewRepo.find({ documentId });
    await this.viewRepo.remove(records);
  }

  async getDocumentTotalViews(documentId) {
    const [, total] = await this.viewRepo.findAndCount({ documentId });
    return total;
  }

  async getDocumentViews(documentId, pagination: IPagination) {
    let { page = 1, pageSize = 12 } = pagination;
    if (page <= 0) {
      page = 1;
    }
    if (pageSize <= 0) {
      pageSize = 12;
    }
    const take = pageSize;
    const skip = page === 1 ? 0 : (page - 1) * pageSize;

    const [data, total] = await this.viewRepo.findAndCount({
      where: { documentId },
      take,
      skip,
    });

    return { data, total };
  }

  async getUserRecentVisitedDocuments(userId: IUser['id']): Promise<
    Array<{
      documentId: IDocument['id'];
      visitedAt: Date;
    }>
  > {
    const now = Date.now();
    const from = convertDateToMysqlTimestamp(now - 3 * ONE_DAY);
    const end = convertDateToMysqlTimestamp(now);
    const count = 20;

    const ret = await this.viewRepo.query(
      `
      SELECT v.documentId, v.visitedAt FROM (
        SELECT ANY_VALUE(documentId) as documentId, ANY_VALUE(created_at) as visitedAt
             FROM view 
             WHERE view.userId = '${userId}'
             AND (view.created_at BETWEEN '${from}' AND '${end}')
             GROUP BY visitedAt
             ORDER BY visitedAt DESC
      ) v
      GROUP BY v.documentId
      LIMIT ${count}
      `
    );
    ret.sort((a, b) => -new Date(a.visitedAt).getTime() + new Date(b.visitedAt).getTime());
    return ret;
  }
}
