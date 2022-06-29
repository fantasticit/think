import { OperateUserAuthDto } from '@dtos/auth.dto';
import { CreateWikiDto } from '@dtos/create-wiki.dto';
import { ShareWikiDto } from '@dtos/share-wiki.dto';
import { UpdateWikiDto } from '@dtos/update-wiki.dto';
// import { WikiUserDto } from '@dtos/wiki-user.dto';
import { WikiEntity } from '@entities/wiki.entity';
// import { WikiUserEntity } from '@entities/wiki-user.entity';
import { array2tree } from '@helpers/tree.helper';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '@services/auth.service';
import { DocumentService } from '@services/document.service';
import { MessageService } from '@services/message.service';
import { OrganizationService } from '@services/organization.service';
import { StarService } from '@services/star.service';
import { UserService } from '@services/user.service';
import { OutUser } from '@services/user.service';
import { ViewService } from '@services/view.service';
import { AuthEnum, buildMessageURL, DocumentStatus, IPagination, WikiStatus, WikiUserRole } from '@think/domains';
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

    // @InjectRepository(WikiUserEntity)
    // private readonly wikiUserRepo: Repository<WikiUserEntity>,

    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,

    @Inject(forwardRef(() => StarService))
    private readonly starService: StarService,

    @Inject(forwardRef(() => DocumentService))
    private readonly documentService: DocumentService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => ViewService))
    private readonly viewService: ViewService,

    @Inject(forwardRef(() => OrganizationService))
    private readonly organizationService: OrganizationService
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

  // /**
  //  * 目标用户是否为知识库成员
  //  * @param wikiId
  //  * @param userId
  //  * @returns
  //  */
  // public async isMember(wikiId: string, userId: string) {
  //   const auth = await this.wikiUserRepo.findOne({ wikiId, userId });
  //   return !!auth && [WikiUserRole.admin, WikiUserRole.normal].includes(auth.userRole);
  // }

  // /**
  //  * 获取知识库成员信息
  //  * @param wikiId
  //  * @param userId
  //  * @returns
  //  */
  // public async findWikiUser(wikiId: string, userId: string) {
  //   return await this.wikiUserRepo.findOne({
  //     userId,
  //     wikiId,
  //   });
  // }

  // /**
  //  * 操作知识库成员（添加、修改角色）
  //  * @param param0
  //  * @returns
  //  */
  // async operateWikiUser({ wikiId, currentUserId, targetUserId, targetUserRole }) {
  //   const wiki = await this.wikiRepo.findOne(wikiId);

  //   // await this.organizationService.canUserVisitOrganization(currentUserId, wiki.organizationId);

  //   // 1. 检查知识库
  //   if (!wiki) {
  //     throw new HttpException('目标知识库不存在', HttpStatus.BAD_REQUEST);
  //   }

  //   const isCurrentUserCreator = currentUserId === wiki.createUserId;
  //   const isTargetUserCreator = targetUserId === wiki.createUserId;

  //   const currentWikiUserRole = isCurrentUserCreator
  //     ? WikiUserRole.admin
  //     : (
  //         await this.wikiUserRepo.findOne({
  //           wikiId: wiki.id,
  //           userId: currentUserId,
  //         })
  //       ).userRole;

  //   // 2. 检查成员是否存在
  //   const targetUser = await this.userService.findOne(targetUserId);
  //   const targetWikiUser = await this.wikiUserRepo.findOne({
  //     wikiId: wiki.id,
  //     userId: targetUserId,
  //   });

  //   if (targetWikiUser) {
  //     if (targetWikiUser.userRole === targetUserRole) return;

  //     // 2.1 修改知识库用户角色
  //     if (targetUserRole === WikiUserRole.admin) {
  //       if (currentWikiUserRole !== WikiUserRole.admin) {
  //         throw new HttpException('您无权限进行该操作', HttpStatus.FORBIDDEN);
  //       }
  //     }
  //     const userRole = isTargetUserCreator ? WikiUserRole.admin : targetUserRole;
  //     const newData = {
  //       ...targetWikiUser,
  //       userRole,
  //     };
  //     const res = await this.wikiUserRepo.merge(targetWikiUser, newData);
  //     const ret = await this.wikiUserRepo.save(res);
  // await this.messageService.notify(targetUser, {
  //   title: `您在「${wiki.name}」的权限已变更`,
  //   message: `您在「${wiki.name}」的权限已变更，快去看看吧！`,
  //   url: buildMessageURL('toWiki')({
  //     organizationId: wiki.organizationId,
  //     wikiId: wiki.id,
  //   }),
  // });
  //     return ret;
  //   } else {
  //     // 2.2. 添加知识库新用户
  //     if (currentWikiUserRole !== WikiUserRole.admin) {
  //       throw new HttpException('您无权限进行该操作', HttpStatus.FORBIDDEN);
  //     }
  //     const data: Partial<WikiUserEntity> = {
  //       wikiId,
  //       organizationId: wiki.organizationId,
  //       createUserId: wiki.createUserId,
  //       userId: targetUserId,
  //       userRole: isTargetUserCreator ? WikiUserRole.admin : targetUserRole,
  //     };
  //     const res = await this.wikiUserRepo.create(data);
  //     const ret = await this.wikiUserRepo.save(res);
  // await this.messageService.notify(targetUser, {
  //   title: `您被添加到知识库「${wiki.name}」`,
  //   message: `您被添加到知识库「${wiki.name}」，快去看看吧！`,
  //   url: buildMessageURL('toWiki')({
  //     organizationId: wiki.organizationId,
  //     wikiId: wiki.id,
  //   }),
  // });
  //     return ret;
  //   }
  // }

  /**
   * 添加知识库成员
   * @param user
   * @param wikiId
   * @param dto
   * @returns
   */
  async addWikiUser(user: OutUser, wikiId, dto: OperateUserAuthDto) {
    const targetUser = await this.userService.findOne({ name: dto.userName });

    if (!targetUser) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }

    const wiki = await this.wikiRepo.findOne(wikiId);
    const homeDoc = await this.getWikiHomeDocument(user, wikiId);

    if (!wiki) {
      throw new HttpException('目标知识库不存在', HttpStatus.NOT_FOUND);
    }

    await this.authService.createOrUpdateOtherUserAuth(user.id, targetUser.id, {
      auth: dto.userAuth,
      organizationId: wiki.organizationId,
      wikiId: wiki.id,
      documentId: null,
    });

    await this.authService.createOrUpdateOtherUserAuth(user.id, targetUser.id, {
      auth: dto.userAuth,
      organizationId: wiki.organizationId,
      wikiId: wiki.id,
      documentId: homeDoc.id,
    });

    await this.messageService.notify(targetUser, {
      title: `您被添加到知识库「${wiki.name}」`,
      message: `您被添加到知识库「${wiki.name}」，快去看看吧！`,
      url: buildMessageURL('toWiki')({
        organizationId: wiki.organizationId,
        wikiId: wiki.id,
      }),
    });
  }

  /**
   * 修改知识库成员
   * @param user
   * @param wikiId
   * @param dto
   * @returns
   */
  async updateWikiUser(user: OutUser, wikiId, dto: OperateUserAuthDto) {
    const targetUser = await this.userService.findOne({ name: dto.userName });

    if (!targetUser) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }

    const wiki = await this.wikiRepo.findOne(wikiId);
    const homeDoc = await this.getWikiHomeDocument(user, wikiId);

    if (!wiki) {
      throw new HttpException('目标知识库不存在', HttpStatus.NOT_FOUND);
    }

    await this.authService.createOrUpdateOtherUserAuth(user.id, targetUser.id, {
      auth: dto.userAuth,
      organizationId: wiki.organizationId,
      wikiId: wiki.id,
      documentId: null,
    });

    await this.authService.createOrUpdateOtherUserAuth(user.id, targetUser.id, {
      auth: dto.userAuth,
      organizationId: wiki.organizationId,
      wikiId: wiki.id,
      documentId: homeDoc.id,
    });

    await this.messageService.notify(targetUser, {
      title: `您在知识库「${wiki.name}」的权限有更新`,
      message: `您在知识库「${wiki.name}」的权限有更新，快去看看吧！`,
      url: buildMessageURL('toWiki')({
        organizationId: wiki.organizationId,
        wikiId: wiki.id,
      }),
    });
  }

  /**
   * 删除知识库成员
   * @param user
   * @param wikiId
   * @param dto
   * @returns
   */
  async deleteWikiUser(user: OutUser, wikiId, dto: OperateUserAuthDto) {
    const targetUser = await this.userService.findOne({ name: dto.userName });

    if (!targetUser) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }

    const wiki = await this.wikiRepo.findOne(wikiId);
    const homeDoc = await this.getWikiHomeDocument(user, wikiId);

    if (!wiki) {
      throw new HttpException('目标知识库不存在', HttpStatus.NOT_FOUND);
    }

    await this.authService.deleteOtherUserAuth(user.id, targetUser.id, {
      auth: dto.userAuth,
      organizationId: wiki.organizationId,
      wikiId: wiki.id,
      documentId: null,
    });

    await this.authService.deleteOtherUserAuth(user.id, targetUser.id, {
      auth: dto.userAuth,
      organizationId: wiki.organizationId,
      wikiId: wiki.id,
      documentId: homeDoc.id,
    });

    await this.messageService.notify(targetUser, {
      title: `您在「${wiki.name}」的权限已变更`,
      message: `您在「${wiki.name}」的权限已变更，快去看看吧！`,
      url: buildMessageURL('toWiki')({
        organizationId: wiki.organizationId,
        wikiId: wiki.id,
      }),
    });
  }

  /**
   * 获取知识库成员
   * @param userId
   * @param wikiId
   */
  async getWikiUsers(user, wikiId) {
    const wiki = await this.wikiRepo.findOne(wikiId);

    if (!wiki) {
      throw new HttpException('目标知识库不存在', HttpStatus.NOT_FOUND);
    }

    await this.authService.canView(user.id, {
      organizationId: wiki.organizationId,
      wikiId: wiki.id,
      documentId: null,
    });

    const { data: usersAuth, total } = await this.authService.getUsersAuthInWiki(wiki.organizationId, wiki.id);

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

  // /**
  //  * 查询知识库指定用户详情
  //  * @param workspaceId
  //  * @param userId
  //  * @returns
  //  */
  // async getWikiUserDetail({ wikiId, userId }): Promise<WikiUserEntity> {
  //   const data = { wikiId, userId };
  //   const wikiUser = await this.wikiUserRepo.findOne(data);
  //   if (!wikiUser) {
  //     throw new HttpException('您不在该知识库中', HttpStatus.FORBIDDEN);
  //   }
  //   return wikiUser;
  // }

  /**
   * 创建知识库
   * @param user
   * @param dto CreateWikiDto
   * @returns
   */
  async createWiki(user: OutUser, dto: CreateWikiDto) {
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

    const { data: userAuths } = await this.authService.getUsersAuthInOrganization(wiki.organizationId);

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
  async getAllWikis(user: OutUser, organizationId, pagination: IPagination) {
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
  async getOwnWikis(user: OutUser, organizationId, pagination: IPagination) {
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
  async getJoinWikis(user: OutUser, organizationId, pagination: IPagination) {
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
  async getWikiDetail(user: OutUser, wikiId: string) {
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
  async getWikiHomeDocument(user: OutUser, wikiId) {
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
  async updateWiki(user: OutUser, wikiId, dto: UpdateWikiDto) {
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
  async deleteWiki(user: OutUser, wikiId) {
    const wiki = await this.wikiRepo.findOne(wikiId);
    await this.authService.canDelete(user.id, {
      organizationId: wiki.organizationId,
      wikiId: wiki.id,
      documentId: null,
    });
    await this.wikiRepo.remove(wiki);
    // TODO: 删除相应文档以及对应权限
    // if (user.id !== wiki.createUserId) {
    //   throw new HttpException('您不是创建者，无法删除该知识库', HttpStatus.FORBIDDEN);
    // }

    // await this.documentService.deleteWikiDocuments(user, wikiId);

    // const users = await this.wikiUserRepo.find({ wikiId });
    // await Promise.all([this.wikiUserRepo.remove(users)]);
    return wiki;
  }

  /**
   * 分享（或关闭分享）知识库
   * @param user
   * @param wikiId
   * @param dto
   * @returns
   */
  async shareWiki(user: OutUser, wikiId, dto: ShareWikiDto) {
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
  async getWikiTocs(user: OutUser, wikiId) {
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

  // /**
  //  * 获取知识库所有文档（无结构嵌套）
  //  * @param user
  //  * @param wikiId
  //  * @returns
  //  */
  // async getWikiDocs(user: OutUser, wikiId) {
  //   // 通过文档成员表获取当前用户可查阅的所有文档
  //   const records = await this.documentService.documentUserRepo.find({
  //     userId: user.id,
  //     wikiId,
  //   });

  //   const ids = records.map((record) => record.documentId);

  //   const documents = await this.documentService.documentRepo.findByIds(ids);

  //   const docs = documents
  //     .filter((doc) => !doc.isWikiHome)
  //     .map((doc) => {
  //       const res = instanceToPlain(doc);
  //       res.key = res.id;
  //       return res;
  //     })
  //     .map((item) => {
  //       return lodash.omit(item, ['content', 'state']);
  //     });

  //   docs.sort((a, b) => a.index - b.index);

  //   const docsWithCreateUser = await Promise.all(
  //     docs.map(async (doc) => {
  //       const createUser = await this.userService.findById(doc.createUserId);
  //       return { ...doc, createUser };
  //     })
  //   );

  //   return docsWithCreateUser;
  // }

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
