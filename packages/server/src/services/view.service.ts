import { ViewEntity } from '@entities/view.entity';
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
    const data = {
      userId,
      documentId,
      originUserAgent: userAgent,
      parsedUserAgent: parseUserAgent(userAgent).text,
    };

    const res = await this.viewRepo.create(data);
    const ret = await this.viewRepo.save(res);

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
    const queryBuilder = this.viewRepo.createQueryBuilder('view');

    queryBuilder.where('view.userId=:userId', { userId }).andWhere('view.createdAt BETWEEN :start AND :end', {
      start: new Date(now - 3 * ONE_DAY),
      end: new Date(now),
    });

    const ret = await queryBuilder.getMany();

    const map = {};

    ret.forEach((item) => {
      const key = item.documentId;
      if (!map[key]) {
        map[key] = item;
      }
      const mapItem = map[key];
      const isGreaterThan = new Date(mapItem.createdAt).valueOf() < new Date(item.createdAt).valueOf();
      if (isGreaterThan) {
        map[key] = item;
      }
    });

    const res = Object.keys(map).map((documentId) => {
      return {
        documentId,
        visitedAt: map[documentId].createdAt,
      };
    });

    res.sort((a, b) => {
      return -new Date(a.visitedAt).valueOf() + new Date(b.visitedAt).valueOf();
    });

    return res.slice(0, 20);
  }
}
