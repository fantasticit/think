import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ViewEntity } from '@entities/view.entity';
import { parseUserAgent } from '@helpers/ua.helper';
import { Pagination } from '@think/share';

@Injectable()
export class ViewService {
  constructor(
    @InjectRepository(ViewEntity)
    private readonly viewRepo: Repository<ViewEntity>,
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

  async getDocumentTotalViews(documentId) {
    const [, total] = await this.viewRepo.findAndCount({ documentId });
    return total;
  }

  async getDocumentViews(documentId, pagination: Pagination) {
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
}
