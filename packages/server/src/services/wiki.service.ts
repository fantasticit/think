import { OperateUserAuthDto } from '@dtos/auth.dto';
import { CreateWikiDto } from '@dtos/create-wiki.dto';
import { ShareWikiDto } from '@dtos/share-wiki.dto';
import { UpdateWikiDto } from '@dtos/update-wiki.dto';
import { WikiEntity } from '@entities/wiki.entity';
import { array2tree } from '@helpers/tree.helper';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '@services/auth.service';
import { DocumentService } from '@services/document.service';
import { MessageService } from '@services/message.service';
import { StarService } from '@services/star.service';
import { UserService } from '@services/user.service';
import { ViewService } from '@services/view.service';
import { AuthEnum, buildMessageURL, DocumentStatus, IPagination, IUser, WikiStatus } from '@think/domains';
import { instanceToPlain } from 'class-transformer';
import * as lodash from 'lodash';
import { Repository } from 'typeorm';

@Injectable()
export class WikiService {
  constructor(
    @InjectRepository(WikiEntity)
    private readonly wikiRepo: Repository<WikiEntity>,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,

    @Inject(forwardRef(() => StarService))
    private readonly starService: StarService,

    @Inject(forwardRef(() => DocumentService))
    private readonly documentService: DocumentService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => ViewService))
    private readonly viewService: ViewService
  ) {}

  /**
   * 按 id 查取知识库
   * @param user
   * @param dto
   * @returns
   */
  public async findById(id: string) {
    return await this.wikiRepo.findOne(id);
  }

  /**
   * 按 id 查取一组知识库
   * @param user
   * @param dto
   * @returns
   */
  public async findByIds(ids: string[]) {
    const ret = await this.wikiRepo.findByIds(ids);
    return ret;
  }

  /**
   * 添加知识库成员
   * @param user
   * @param wikiId
   * @param dto
   * @returns
   */
  async addWikiUser(user: IUser, wikiId, dto: OperateUserAuthDto) {
    const targetUser = await this.userService.findOne({ name: dto.userName });

    if (!targetUser) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }

    const wiki = await this.wikiRepo.findOne(wikiId);

    if (!wiki) {
      throw new HttpException('目标知识库不存在', HttpStatus.NOT_FOUND);
    }

    if (
      !(await this.authService.getAuth(targetUser.id, {
        organizationId: wiki.organizationId,
        wikiId: null,
        documentId: null,
      }))
    ) {
      throw new HttpException('该用户非组织成员', HttpStatus.FORBIDDEN);
    }

    const homeDoc = await this.getWikiHomeDocument(user, wikiId);

    await Promise.all([
      this.authService.createOrUpdateOtherUserAuth(user.id, targetUser.id, {
        auth: dto.userAuth,
        organizationId: wiki.organizationId,
        wikiId: wiki.id,
        documentId: null,
      }),

      this.authService.createOrUpdateOtherUserAuth(user.id, targetUser.id, {
        auth: dto.userAuth,
        organizationId: wiki.organizationId,
        wikiId: wiki.id,
        documentId: homeDoc.id,
      }),
    ]);

    await this.messageService.notify(targetUser.id, {
      title: `您被添加到知识库「${wiki.name}」`,
      message: `您被添加到知识库「${wiki.name}」，快去看看吧！`,
      url: buildMessageURL('toWiki')({
        organizationId: wiki.organizationId,
        wikiId: wiki.id,
      }),
      uniqueId: wiki.id,
    });
  }

  /**
   * 修改知识库成员
   * @param user
   * @param wikiId
   * @param dto
   * @returns
   */
  async updateWikiUser(user: IUser, wikiId, dto: OperateUserAuthDto) {
    const targetUser = await this.userService.findOne({ name: dto.userName });

    if (!targetUser) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }

    const wiki = await this.wikiRepo.findOne(wikiId);
    const homeDoc = await this.getWikiHomeDocument(user, wikiId);

    if (!wiki) {
      throw new HttpException('目标知识库不存在', HttpStatus.NOT_FOUND);
    }

    await Promise.all([
      this.authService.createOrUpdateOtherUserAuth(user.id, targetUser.id, {
        auth: dto.userAuth,
        organizationId: wiki.organizationId,
        wikiId: wiki.id,
        documentId: null,
      }),

      this.authService.createOrUpdateOtherUserAuth(user.id, targetUser.id, {
        auth: dto.userAuth,
        organizationId: wiki.organizationId,
        wikiId: wiki.id,
        documentId: homeDoc.id,
      }),
    ]);

    await this.messageService.notify(targetUser.id, {
      title: `您在知识库「${wiki.name}」的权限有更新`,
      message: `您在知识库「${wiki.name}」的权限有更新，快去看看吧！`,
      url: buildMessageURL('toWiki')({
        organizationId: wiki.organizationId,
        wikiId: wiki.id,
      }),
      uniqueId: wiki.id,
    });
  }

  /**
   * 删除知识库成员
   * @param user
   * @param wikiId
   * @param dto
   * @returns
   */
  async deleteWikiUser(user: IUser, wikiId, dto: OperateUserAuthDto) {
    const targetUser = await this.userService.findOne({ name: dto.userName });

    if (!targetUser) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }

    const wiki = await this.wikiRepo.findOne(wikiId);
    const homeDoc = await this.getWikiHomeDocument(user, wikiId);

    if (!wiki) {
      throw new HttpException('目标知识库不存在', HttpStatus.NOT_FOUND);
    }

    await Promise.all([
      this.authService.deleteOtherUserAuth(user.id, targetUser.id, {
        auth: dto.userAuth,
        organizationId: wiki.organizationId,
        wikiId: wiki.id,
        documentId: null,
      }),

      this.authService.deleteOtherUserAuth(user.id, targetUser.id, {
        auth: dto.userAuth,
        organizationId: wiki.organizationId,
        wikiId: wiki.id,
        documentId: homeDoc.id,
      }),
    ]);

    await this.messageService.notify(targetUser.id, {
      title: `知识库「${wiki.name}」的权限收回`,
      message: `您在知识库「「${wiki.name}」的权限已收回！`,
      url: buildMessageURL('toWiki')({
        organizationId: wiki.organizationId,
        wikiId: wiki.id,
      }),
      uniqueId: wiki.id,
    });
  }

  /**
   * 获取知识库成员
   * @param userId
   * @param wikiId
   */
  async getWikiUsers(user, wikiId, pagination) {
    const wiki = await this.wikiRepo.findOne(wikiId);

    if (!wiki) {
      throw new HttpException('目标知识库不存在', HttpStatus.NOT_FOUND);
    }

    await this.authService.canView(user.id, {
      organizationId: wiki.organizationId,
      wikiId: wiki.id,
      documentId: null,
    });

    const { data: usersAuth, total } = await this.authService.getUsersAuthInWiki(
      wiki.organizationId,
      wiki.id,
      pagination
    );

    const userIds = usersAuth.map((auth) => auth.userId);
    const users = await this.userService.findByIds(userIds);

    const withUserData = usersAuth.map((auth) => {
      return {
        auth,
        user: users.find((user) => user.id === auth.userId),
      };
    });

    return { data: withUserData, total };
  }

  /**
   * 创建知识库
   * @param user
   * @param dto CreateWikiDto
   * @returns
   */
  async createWiki(user: IUser, dto: CreateWikiDto) {
    await this.authService.canView(user.id, {
      organizationId: dto.organizationId,
      wikiId: null,
      documentId: null,
    });

    const createUserId = user.id;
    const data = {
      ...dto,
      createUserId,
    };
    const toSaveWiki = await this.wikiRepo.create(data);
    const wiki = await this.wikiRepo.save(toSaveWiki);

    const { data: userAuths } = await this.authService.getUsersAuthInOrganization(wiki.organizationId, null);

    await Promise.all([
      ...userAuths
        .filter((userAuth) => userAuth.userId !== user.id)
        .map((userAuth) => {
          return this.authService.createOrUpdateAuth(userAuth.userId, {
            auth: userAuth.auth,
            organizationId: wiki.organizationId,
            wikiId: wiki.id,
            documentId: null,
          });
        }),

      await this.authService.createOrUpdateAuth(user.id, {
        auth: AuthEnum.creator,
        organizationId: wiki.organizationId,
        wikiId: wiki.id,
        documentId: null,
      }),

      await this.starService.toggleStar(user, {
        organizationId: wiki.organizationId,
        wikiId: wiki.id,
      }),
    ]);

    const homeDoc = await this.documentService.createDocument(
      user,
      {
        organizationId: wiki.organizationId,
        wikiId: wiki.id,
        parentDocumentId: null,
        title: wiki.name,
      },
      true
    );

    const homeDocumentId = homeDoc.id;
    const withHomeDocumentIdWiki = await this.wikiRepo.merge(wiki, { homeDocumentId });
    await this.wikiRepo.save(withHomeDocumentIdWiki);
    return withHomeDocumentIdWiki;
  }

  /**
   * 获取当前用户所有知识库
   * @param user
   * @param pagination
   * @returns
   */
  async getAllWikis(user: IUser, organizationId, pagination: IPagination) {
    await this.authService.canView(user.id, {
      organizationId,
      wikiId: null,
      documentId: null,
    });

    const { page = 1, pageSize = 12 } = pagination;
    const { data: userWikiAuths, total } = await this.authService.getUserCanViewWikisInOrganization(
      user.id,
      organizationId
    );
    const wikiIds = userWikiAuths.map((userAuth) => userAuth.wikiId);

    const data = await this.wikiRepo.findByIds(wikiIds);
    const ret = await Promise.all(
      data.map(async (wiki) => {
        const createUser = await this.userService.findById(wiki.createUserId);
        return { ...wiki, createUser, isMember: true };
      })
    );

    return { data: ret, total };
  }

  /**
   * 获取当前用户创建的知识库
   * @param user
   * @param pagination
   * @returns
   */
  async getOwnWikis(user: IUser, organizationId, pagination: IPagination) {
    await this.authService.canView(user.id, {
      organizationId,
      wikiId: null,
      documentId: null,
    });

    const { page = 1, pageSize = 12 } = pagination;
    const { data: userWikiAuths, total } = await this.authService.getUserCreateWikisInOrganization(
      user.id,
      organizationId
    );
    const wikiIds = userWikiAuths.map((userAuth) => userAuth.wikiId);

    const data = await this.wikiRepo.findByIds(wikiIds);
    const ret = await Promise.all(
      data.map(async (wiki) => {
        const createUser = await this.userService.findById(wiki.createUserId);
        return { ...wiki, createUser, isMember: true };
      })
    );
    return { data: ret, total };
  }

  /**
   * 获取当前用户参与的知识库
   * @param user
   * @param pagination
   * @returns
   */
  async getJoinWikis(user: IUser, organizationId, pagination: IPagination) {
    await this.authService.canView(user.id, {
      organizationId,
      wikiId: null,
      documentId: null,
    });

    const { page = 1, pageSize = 12 } = pagination;
    const { data: userWikiAuths, total } = await this.authService.getUserJoinWikisInOrganization(
      user.id,
      organizationId
    );
    const wikiIds = userWikiAuths.map((userAuth) => userAuth.wikiId);

    const data = await this.wikiRepo.findByIds(wikiIds);
    const ret = await Promise.all(
      data.map(async (wiki) => {
        const createUser = await this.userService.findById(wiki.createUserId);
        return { ...wiki, createUser, isMember: true };
      })
    );

    return { data: ret, total };
  }

  /**
   * 获取知识库详情
   * @param user
   * @param wikiId
   * @returns
   */
  async getWikiDetail(user: IUser, wikiId: string) {
    const wiki = await this.wikiRepo.findOne(wikiId);
    await this.authService.canView(user.id, {
      organizationId: wiki.organizationId,
      wikiId: wiki.id,
      documentId: null,
    });
    const createUser = await this.userService.findById(wiki.createUserId);
    return { ...wiki, createUser };
  }

  /**
   * 获取知识库首页文档（首页文档由系统自动创建）
   * @param user
   * @param wikiId
   * @returns
   */
  async getWikiHomeDocument(user: IUser, wikiId) {
    const res = await this.documentService.documentRepo.findOne({ wikiId, isWikiHome: true });
    await this.authService.canView(user.id, {
      organizationId: res.organizationId,
      wikiId: res.wikiId,
      documentId: null,
    });
    return lodash.omit(instanceToPlain(res), ['state']);
  }

  /**
   * 更新指定知识库
   * @param user
   * @param wikiId
   * @param dto
   * @returns
   */
  async updateWiki(user: IUser, wikiId, dto: UpdateWikiDto) {
    const oldData = await this.wikiRepo.findOne(wikiId);
    if (!oldData) {
      throw new HttpException('目标知识库不存在', HttpStatus.NOT_FOUND);
    }
    await this.authService.canEdit(user.id, {
      organizationId: oldData.organizationId,
      wikiId: oldData.id,
      documentId: null,
    });
    const newData = {
      ...oldData,
      ...dto,
    };
    const res = await this.wikiRepo.merge(oldData, newData);
    return await this.wikiRepo.save(res);
  }

  /**
   * 删除知识库
   * @param user
   * @param wikiId
   * @returns
   */
  async deleteWiki(user: IUser, wikiId) {
    const wiki = await this.wikiRepo.findOne(wikiId);
    await this.authService.canDelete(user.id, {
      organizationId: wiki.organizationId,
      wikiId: wiki.id,
      documentId: null,
    });
    await this.wikiRepo.remove(wiki);
    await this.documentService.deleteWikiDocuments(user, wikiId);
    await this.authService.deleteWiki(wiki.organizationId, wiki.id);
    return wiki;
  }

  /**
   * 删除组织下所有知识库
   * @param user
   * @param wikiId
   */
  async deleteOrganizationWiki(user, organizationId) {
    const wikis = await this.wikiRepo.find({ organizationId });
    await Promise.all(
      wikis.map((wiki) => {
        return this.deleteWiki(user, wiki.id);
      })
    );
  }

  /**
   * 分享（或关闭分享）知识库
   * @param user
   * @param wikiId
   * @param dto
   * @returns
   */
  async shareWiki(user: IUser, wikiId, dto: ShareWikiDto) {
    const wiki = await this.wikiRepo.findOne(wikiId);

    if (!wiki) {
      throw new HttpException('目标知识库不存在', HttpStatus.NOT_FOUND);
    }

    await this.authService.canEdit(user.id, {
      organizationId: wiki.organizationId,
      wikiId: wiki.id,
      documentId: null,
    });

    const newData = await this.wikiRepo.merge(wiki, {
      status: dto.nextStatus,
    });

    let operateDocumentError = false;
    const handleDocs = async (docIds, nextStatus) => {
      if (docIds && Array.isArray(docIds)) {
        try {
          await Promise.all(
            docIds.map((docId) => this.documentService.shareDocument(user, docId, { sharePassword: '' }, nextStatus))
          );
        } catch (err) {
          operateDocumentError = true;
        }
      }
    };

    const publicDocumentIds = dto.publicDocumentIds || [];

    if (dto.nextStatus === WikiStatus.public) {
      // 把首页文档公开
      const homeDoc = await this.getWikiHomeDocument(user, wiki.id);
      if (homeDoc) {
        publicDocumentIds.push(homeDoc.id);
      }
    }

    await handleDocs(publicDocumentIds, DocumentStatus.public);
    await handleDocs(dto.privateDocumentIds, DocumentStatus.private);
    const ret = await this.wikiRepo.save(newData);
    return {
      ...ret,
      documentOperateMessage: operateDocumentError ? '知识库操作成功，部分文档可能无编辑权限，未能修改成功' : null,
    };
  }

  /**
   * 获取知识库目录
   * @param user
   * @param wikiId
   * @returns
   */
  async getWikiTocs(user: IUser, wikiId) {
    const wiki = await this.wikiRepo.findOne(wikiId);

    const records = await this.authService.getUserCanViewDocumentsInWiki(wiki.organizationId, wiki.id);

    const ids = records.map((record) => record.documentId);
    const documents = await this.documentService.documentRepo.findByIds(ids, {
      order: { createdAt: 'ASC' },
    });
    documents.sort((a, b) => a.index - b.index);

    const docs = documents
      .filter((doc) => !doc.isWikiHome)
      .map((doc) => {
        const res = instanceToPlain(doc);
        res.key = res.id;
        res.label = res.title;
        return res;
      })
      .map((item) => {
        return lodash.omit(item, ['content', 'state']);
      });

    return array2tree(docs);
  }

  /**
   * 重排知识库目录
   * @param user
   * @param wikiId
   * @param relations
   */
  public async orderWikiTocs(relations: Array<{ id: string; parentDocumentId?: string; index: number }>) {
    if (!relations.length) return;

    await Promise.all(
      relations.map(async (relation) => {
        const { id, parentDocumentId, index } = relation;
        const doc = await this.documentService.documentRepo.findOne(id);

        if (doc) {
          const newData = await this.documentService.documentRepo.merge(doc, {
            parentDocumentId,
            index,
          });
          await this.documentService.documentRepo.save(newData);
        }
      })
    );
  }

  /**
   * 获取公开知识库目录
   * @param wikiId
   * @returns
   */
  async getPublicWikiTocs(wikiId) {
    const unSortDocuments = await this.documentService.documentRepo.find({
      wikiId,
      status: DocumentStatus.public,
    });

    const documents = await this.documentService.documentRepo.findByIds(
      unSortDocuments.map((d) => d.id),
      {
        order: { createdAt: 'ASC' },
      }
    );

    documents.sort((a, b) => a.index - b.index);

    const docs = documents
      .filter((doc) => !doc.isWikiHome)
      .map((doc) => {
        const res = instanceToPlain(doc);
        res.key = res.id;
        res.label = res.title;
        return res;
      })
      .map((item) => {
        return lodash.omit(item, ['content', 'state']);
      });

    return array2tree(docs);
  }

  /**
   * 获取公开知识库首页文档（首页文档由系统自动创建）
   * @param user
   * @param wikiId
   * @returns
   */
  async getPublicWikiHomeDocument(wikiId) {
    const res = await this.documentService.documentRepo.findOne({ wikiId, isWikiHome: true });
    this.viewService.create(null, res);
    const views = await this.viewService.getDocumentTotalViews(res.id);
    return { ...lodash.omit(instanceToPlain(res), ['state']), views };
  }

  /**
   * 获取公开知识库详情
   * @param wikiId
   * @returns
   */
  async getPublicWikiDetail(wikiId: string) {
    const wiki = await this.wikiRepo.findOne(wikiId);
    const createUser = await this.userService.findById(wiki.createUserId);
    return { ...wiki, createUser };
  }

  /**
   * 获取所有公开知识库
   * @param user
   * @param pagination
   * @returns
   */
  async getAllPublicWikis(pagination: IPagination) {
    const { page = 1, pageSize = 12 } = pagination;
    const query = await this.wikiRepo
      .createQueryBuilder('wiki')
      .where('wiki.status=:status')
      .setParameter('status', WikiStatus.public);

    query.skip((+page - 1) * +pageSize);
    query.take(+pageSize);

    const [wikis, total] = await query.getManyAndCount();

    const ret = await Promise.all(
      wikis.map(async (wiki) => {
        const createUser = await this.userService.findById(wiki.createUserId);
        return { ...wiki, createUser };
      })
    );

    return { data: ret, total };
  }
}
