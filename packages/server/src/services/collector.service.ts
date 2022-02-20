import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectType } from '@think/share';
import { OutUser, UserService } from '@services/user.service';
import { WikiService } from '@services/wiki.service';
import { DocumentService } from '@services/document.service';
import { CollectorEntity } from '@entities/collector.entity';
import { CollectDto } from '@dtos/collect.dto';

@Injectable()
export class CollectorService {
  constructor(
    @InjectRepository(CollectorEntity)
    private readonly collectorRepo: Repository<CollectorEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => WikiService))
    private readonly wikiService: WikiService,
    @Inject(forwardRef(() => DocumentService))
    private readonly documentService: DocumentService,
  ) {}

  async toggleStar(user: OutUser, dto: CollectDto) {
    const data = {
      ...dto,
      userId: user.id,
    };
    const record = await this.collectorRepo.findOne(data);
    if (record) {
      return await this.collectorRepo.remove(record);
    } else {
      const res = await this.collectorRepo.create(data);
      const ret = await this.collectorRepo.save(res);
      return ret;
    }
  }

  async isStared(user: OutUser, dto: CollectDto) {
    const res = await this.collectorRepo.findOne({ userId: user.id, ...dto });
    return Boolean(res);
  }

  async getWikis(user: OutUser) {
    const records = await this.collectorRepo.find({
      userId: user.id,
      type: CollectType.wiki,
    });
    const res = await this.wikiService.findByIds(
      records.map((record) => record.targetId),
    );

    return res;
  }

  async getDocuments(user: OutUser) {
    const records = await this.collectorRepo.find({
      userId: user.id,
      type: CollectType.document,
    });
    return await this.documentService.findByIds(
      records.map((record) => record.targetId),
    );
  }
}
