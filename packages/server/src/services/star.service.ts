import { StarDto } from '@dtos/star.dto';
import { StarEntity } from '@entities/star.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '@services/auth.service';
import { DocumentService } from '@services/document.service';
import { OrganizationService } from '@services/organization.service';
import { UserService } from '@services/user.service';
import { WikiService } from '@services/wiki.service';
import { IDocument, IUser } from '@think/domains';
import * as lodash from 'lodash';
import { Repository } from 'typeorm';

@Injectable()
export class StarService {
  constructor(
    @InjectRepository(StarEntity)
    private readonly starRepo: Repository<StarEntity>,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => OrganizationService))
    private readonly organizationService: OrganizationService,

    @Inject(forwardRef(() => WikiService))
    private readonly wikiService: WikiService,

    @Inject(forwardRef(() => DocumentService))
    private readonly documentService: DocumentService
  ) {}

  /**
   * 加星或取消加星
   * @param user
   * @param dto
   * @returns
   */
  async toggleStar(user: IUser, dto: StarDto) {
    const data = {
      ...dto,
      userId: user.id,
    };
    const record = await this.starRepo.findOne(data);
    if (record) {
      await this.starRepo.remove(record);
      return;
    } else {
      const res = await this.starRepo.create(data);
      const ret = await this.starRepo.save(res);
      return ret;
    }
  }

  /**
   * 是否加星
   * @param user
   * @param dto
   * @returns
   */
  async isStared(user: IUser, dto: StarDto) {
    const res = await this.starRepo.findOne({ userId: user.id, ...dto });
    return Boolean(res);
  }

  /**
   * 获取组织内加星的知识库
   * @param user
   * @returns
   */
  async getStarWikisInOrganization(user: IUser, organizationId) {
    await this.authService.canView(user.id, {
      organizationId: organizationId,
      wikiId: null,
      documentId: null,
    });

    const records = await this.starRepo.find({
      organizationId,
      userId: user.id,
      documentId: null,
    });
    const res = await this.wikiService.findByIds(records.map((record) => record.wikiId));
    const withCreateUserRes = await Promise.all(
      res.map(async (wiki) => {
        const createUser = await this.userService.findById(wiki.createUserId);
        // const isMember = await this.wikiService.isMember(wiki.id, user.id);
        return { createUser, isMember: true, ...wiki };
      })
    );

    return withCreateUserRes;
  }

  /**
   * 获取知识库加星的文档
   * @param user
   * @returns
   */
  async getStarDocumentsInWiki(user: IUser, dto: StarDto) {
    const records = await this.starRepo.find({
      userId: user.id,
      wikiId: dto.wikiId,
    });

    const res = await this.documentService.findByIds(
      records.filter((record) => record.documentId).map((record) => record.documentId)
    );
    const withCreateUserRes = (await Promise.all(
      res.map(async (doc) => {
        const createUser = await this.userService.findById(doc.createUserId);
        return { createUser, ...doc };
      })
    )) as Array<IDocument & { createUser: IUser }>;

    return withCreateUserRes
      .map((document) => {
        return lodash.omit(document, ['state', 'content', 'index', 'createUserId']);
      })
      .map((doc) => {
        return {
          ...doc,
          key: doc.id,
          label: doc.title,
        };
      });
  }

  /**
   * 获取组织内加星的文档（平铺）
   * @param user
   * @returns
   */
  async getStarDocumentsInOrganization(user: IUser, organizationId) {
    await this.authService.canView(user.id, {
      organizationId: organizationId,
      wikiId: null,
      documentId: null,
    });

    const records = await this.starRepo.find({
      organizationId,
      userId: user.id,
    });
    const res = await this.documentService.findByIds(records.map((record) => record.documentId));
    const withCreateUserRes = await Promise.all(
      res.map(async (doc) => {
        const createUser = await this.userService.findById(doc.createUserId);
        return { createUser, ...doc };
      })
    );

    return withCreateUserRes.map((document) => {
      return lodash.omit(document, ['state', 'content', 'index', 'createUserId']);
    });
  }
}
