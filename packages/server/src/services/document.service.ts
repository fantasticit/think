import { OperateUserAuthDto } from '@dtos/auth.dto';
import { CreateDocumentDto } from '@dtos/create-document.dto';
// import { DocAuthDto } from '@dtos/doc-auth.dto';
import { ShareDocumentDto } from '@dtos/share-document.dto';
import { UpdateDocumentDto } from '@dtos/update-document.dto';
import { DocumentEntity } from '@entities/document.entity';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '@services/auth.service';
import { CollaborationService } from '@services/collaboration.service';
import { DocumentVersionService } from '@services/document-version.service';
import { MessageService } from '@services/message.service';
import { TemplateService } from '@services/template.service';
import { OutUser, UserService } from '@services/user.service';
import { ViewService } from '@services/view.service';
import { WikiService } from '@services/wiki.service';
import { EMPTY_DOCUMNENT } from '@think/constants';
import { AuthEnum, buildMessageURL, DocumentStatus, WikiUserRole } from '@think/domains';
import { instanceToPlain } from 'class-transformer';
import * as lodash from 'lodash';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentService {
  private collaborationService: CollaborationService;
  private documentVersionService: DocumentVersionService;

  constructor(
    // @InjectRepository(DocumentUserEntity)
    // public readonly documentUserRepo: Repository<DocumentUserEntity>,

    @InjectRepository(DocumentEntity)
    public readonly documentRepo: Repository<DocumentEntity>,

    @Inject(forwardRef(() => ConfigService))
    private readonly configService: ConfigService,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => WikiService))
    private readonly wikiService: WikiService,

    @Inject(forwardRef(() => TemplateService))
    private readonly templateService: TemplateService,

    @Inject(forwardRef(() => ViewService))
    private readonly viewService: ViewService
  ) {
    this.documentVersionService = new DocumentVersionService(this.userService);
    this.collaborationService = new CollaborationService(
      this.userService,
      this,
      this.templateService,
      this.documentVersionService,
      this.configService
    );
  }

  /**
   * 按 id 查取文档
   * @param user
   * @param dto
   * @returns
   */
  public async findById(id: string) {
    const document = await this.documentRepo.findOne(id);
    return instanceToPlain(document);
  }

  /**
   * 按 id 查取一组文档
   * @param user
   * @param dto
   * @returns
   */
  public async findByIds(ids: string[]) {
    const documents = await this.documentRepo.findByIds(ids);
    return documents.map((doc) => instanceToPlain(doc));
  }

  /**
   * 获取知识库首页文档
   * @param wikiId
   * @returns
   */
  public async findWikiHomeDocument(wikiId) {
    return await this.documentRepo.findOne({ wikiId, isWikiHome: true });
  }

  // /**
  //  * 获取用户在指定文档的权限
  //  * @param documentId
  //  * @param userId
  //  * @returns
  //  */
  // public async getDocumentAuthority(documentId: string, userId: string) {
  //   const authority = await this.documentUserRepo.findOne({
  //     documentId,
  //     userId,
  //   });
  //   return authority;
  // }

  /**
   * 操作文档成员权限（可读、可编辑）
   * @param param0
   * @returns
  //  */
  // async operateDocumentAuth({ currentUserId, documentId, targetUserId, readable = false, editable = false }) {
  //   const doc = await this.documentRepo.findOne({ id: documentId });
  //   if (!doc) {
  //     throw new HttpException('文档不存在', HttpStatus.BAD_REQUEST);
  //   }

  //   const isCurrentUserCreator = currentUserId === doc.createUserId;
  //   const isTargetUserCreator = targetUserId === doc.createUserId;

  //   if (!isCurrentUserCreator) {
  //     throw new HttpException('您不是文档创建者，无权操作', HttpStatus.FORBIDDEN);
  //   }

  //   const targetUser = await this.userService.findOne(targetUserId);
  //   const targetDocAuth = await this.documentUserRepo.findOne({
  //     documentId,
  //     userId: targetUserId,
  //   });

  //   if (!targetDocAuth) {
  //     const documentUser = {
  //       documentId,
  //       createUserId: doc.createUserId,
  //       wikiId: doc.wikiId,
  //       userId: targetUserId,
  //       readable: isTargetUserCreator ? true : editable ? true : readable,
  //       editable: isTargetUserCreator ? true : editable,
  //     };
  //     const res = await this.documentUserRepo.create(documentUser);
  //     const ret = await this.documentUserRepo.save(res);

  //     await this.messageService.notify(targetUser, {
  //       title: `您已被添加到文档「${doc.title}」`,
  //       message: `您已被添加到文档「${doc.title}」，快去看看！`,
  //       url: buildMessageURL('toDocument')({
  //         organizationId: doc.organizationId,
  //         wikiId: doc.wikiId,
  //         documentId: doc.id,
  //       }),
  //     });

  //     return ret;
  //   } else {
  //     const newData = {
  //       ...targetDocAuth,
  //       readable: isTargetUserCreator ? true : editable ? true : readable,
  //       editable: isTargetUserCreator ? true : editable,
  //     };
  //     const res = await this.documentUserRepo.merge(targetDocAuth, newData);
  //     const ret = await this.documentUserRepo.save(res);

  //     await this.messageService.notify(targetUser, {
  //       title: `您在文档「${doc.title}」的权限已变更`,
  //       message: `您在文档「${doc.title}」的权限已变更，快去看看！`,
  //       url: buildMessageURL('toDocument')({
  //         organizationId: doc.organizationId,
  //         wikiId: doc.wikiId,
  //         documentId: doc.id,
  //       }),
  //     });

  //     return ret;
  //   }
  // }

  /**
   * 添加文档成员
   * @param user
   * @param documentId
   * @param dto
   * @returns
   */
  async addDocUser(user: OutUser, documentId, dto: OperateUserAuthDto) {
    const targetUser = await this.userService.findOne({ name: dto.userName });

    if (!targetUser) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }

    const doc = await this.documentRepo.findOne(documentId);

    if (!doc) {
      throw new HttpException('目标文档不存在', HttpStatus.NOT_FOUND);
    }

    await this.authService.createOrUpdateOtherUserAuth(user.id, targetUser.id, {
      auth: dto.userAuth,
      organizationId: doc.organizationId,
      wikiId: doc.wikiId,
      documentId: doc.id,
    });
  }

  /**
   * 修改文档成员
   * @param user
   * @param documentId
   * @param dto
   * @returns
   */
  async updateDocUser(user: OutUser, documentId, dto: OperateUserAuthDto) {
    const targetUser = await this.userService.findOne({ name: dto.userName });

    if (!targetUser) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }

    const doc = await this.documentRepo.findOne(documentId);

    if (!doc) {
      throw new HttpException('目标文档不存在', HttpStatus.NOT_FOUND);
    }

    await this.authService.createOrUpdateOtherUserAuth(user.id, targetUser.id, {
      auth: dto.userAuth,
      organizationId: doc.organizationId,
      wikiId: doc.wikiId,
      documentId: doc.id,
    });
  }

  /**
   * 删除文档成员
   * @param user
   * @param documentId
   * @param dto
   * @returns
   */
  async deleteDocUser(user: OutUser, documentId, dto: OperateUserAuthDto) {
    const targetUser = await this.userService.findOne({ name: dto.userName });

    if (!targetUser) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }

    const doc = await this.documentRepo.findOne(documentId);

    if (!doc) {
      throw new HttpException('目标文档不存在', HttpStatus.NOT_FOUND);
    }

    await this.authService.createOrUpdateOtherUserAuth(user.id, targetUser.id, {
      auth: dto.userAuth,
      organizationId: doc.organizationId,
      wikiId: doc.wikiId,
      documentId: doc.id,
    });
  }

  /**
   * 获取文档成员
   * @param userId
   * @param wikiId
   */
  async getDocUsers(user: OutUser, documentId) {
    const doc = await this.documentRepo.findOne({ id: documentId });

    if (!doc) {
      throw new HttpException('文档不存在', HttpStatus.BAD_REQUEST);
    }

    await this.authService.canView(user.id, {
      organizationId: doc.organizationId,
      wikiId: doc.wikiId,
      documentId: doc.id,
    });

    const { data: auths, total } = await this.authService.getUsersAuthInDocument(
      doc.organizationId,
      doc.wikiId,
      doc.id
    );

    const res = await Promise.all(
      auths.map(async (auth) => {
        const user = await this.userService.findById(auth.userId);
        return { auth, user };
      })
    );

    return { data: res, total };
  }

  // /**
  //  * 获取文档成员
  //  * 忽略权限检查
  //  * @param userId
  //  * @param wikiId
  //  */
  // async getDocUsersWithoutAuthCheck(user: OutUser, documentId) {
  //   const doc = await this.documentRepo.findOne({ id: documentId });

  //   if (!doc) {
  //     throw new HttpException('文档不存在', HttpStatus.BAD_REQUEST);
  //   }

  //   const data = await this.documentUserRepo.find({ documentId });

  //   return await Promise.all(
  //     data.map(async (auth) => {
  //       const user = await this.userService.findById(auth.userId);
  //       return { auth, user };
  //     })
  //   );
  // }

  /**
   * 创建文档
   * @param user
   * @param dto
   * @param isWikiHome 知识库首页文档
   * @returns
   */
  public async createDocument(user: OutUser, dto: CreateDocumentDto, isWikiHome = false) {
    await this.authService.canView(user.id, {
      organizationId: dto.organizationId,
      wikiId: dto.wikiId,
      documentId: null,
    });

    const [docs] = await this.documentRepo.findAndCount({ createUserId: user.id });
    const maxIndex = docs.length
      ? Math.max.apply(
          [],
          docs.map((doc) => +doc.index)
        )
      : -1;

    let state = EMPTY_DOCUMNENT.state;

    if ('state' in dto) {
      state = Buffer.from(dto.state);
      delete dto.state;
    }

    const data = {
      createUserId: user.id,
      isWikiHome,
      title: '未命名文档',
      index: maxIndex + 1,
      ...EMPTY_DOCUMNENT,
      ...dto,
      state,
    };

    if (dto.templateId) {
      const template = await this.templateService.findById(dto.templateId);
      if (template) {
        if (template.createUserId !== user.id && !template.isPublic) {
          throw new HttpException('您无法使用该模板', HttpStatus.FORBIDDEN);
        }
        await this.templateService.useTemplate(user, template.id);
        Object.assign(data, {
          title: template.title,
          content: template.content,
          state: template.state,
        });
      }
    }

    const document = await this.documentRepo.save(await this.documentRepo.create(data));
    const { data: userAuths } = await this.authService.getUsersAuthInWiki(document.organizationId, document.wikiId);

    await Promise.all([
      ...userAuths
        .filter((userAuth) => userAuth.userId !== user.id)
        .map((userAuth) => {
          return this.authService.createOrUpdateAuth(userAuth.userId, {
            auth: userAuth.auth,
            organizationId: document.organizationId,
            wikiId: document.wikiId,
            documentId: document.id,
          });
        }),
      await this.authService.createOrUpdateAuth(user.id, {
        auth: AuthEnum.creator,
        organizationId: document.organizationId,
        wikiId: document.wikiId,
        documentId: document.id,
      }),
    ]);

    return instanceToPlain(document);
  }

  // /**
  //  * 删除知识库下所有文档
  //  * @param user
  //  * @param wikiId
  //  */
  // async deleteWikiDocuments(user, wikiId) {
  //   const docs = await this.documentRepo.find({ wikiId });
  //   await Promise.all(
  //     docs.map((doc) => {
  //       return this.deleteDocument(user, doc.id);
  //     })
  //   );
  // }

  /**
   * 删除文档
   * @param idd
   */
  async deleteDocument(user: OutUser, documentId) {
    const document = await this.documentRepo.findOne(documentId);
    if (document.isWikiHome) {
      const isWikiExist = await this.wikiService.findById(document.wikiId);
      if (isWikiExist) {
        throw new HttpException('该文档作为知识库首页使用，无法删除', HttpStatus.FORBIDDEN);
      }
    }

    await this.authService.canDelete(user.id, {
      organizationId: document.organizationId,
      wikiId: document.wikiId,
      documentId: document.id,
    });

    const children = await this.documentRepo.find({
      parentDocumentId: document.id,
    });
    if (children && children.length) {
      const parentDocumentId = document.parentDocumentId;
      await Promise.all(
        children.map(async (doc) => {
          const res = await this.documentRepo.create({
            ...doc,
            parentDocumentId,
          });
          await this.documentRepo.save(res);
        })
      );
    }

    // TODO：权限删除
    // const auths = await this.documentUserRepo.find({ documentId });
    // await this.documentUserRepo.remove(auths);

    return this.documentRepo.remove(document);
  }

  /**
   * 更新文档
   * @param user
   * @param documentId
   * @param dto
   * @returns
   */
  public async updateDocument(user: OutUser, documentId: string, dto: UpdateDocumentDto) {
    const document = await this.documentRepo.findOne(documentId);

    await this.authService.canEdit(user.id, {
      organizationId: document.organizationId,
      wikiId: document.wikiId,
      documentId: document.id,
    });

    const res = await this.documentRepo.create({ ...document, ...dto });
    const ret = await this.documentRepo.save(res);
    return instanceToPlain(ret);
  }

  /**
   * 获取文档详情
   * @param user
   * @param documentId
   * @returns
   */
  public async getDocumentDetail(user, documentId: string) {
    const [document, views] = await Promise.all([
      this.documentRepo.findOne(documentId),
      this.viewService.getDocumentTotalViews(documentId),
    ]);
    await this.authService.canView(user.id, {
      organizationId: document.organizationId,
      wikiId: document.wikiId,
      documentId: document.id,
    });
    const authority = await this.authService.getAuth(user.id, {
      organizationId: document.organizationId,
      wikiId: document.wikiId,
      documentId: document.id,
    });
    // 异步记录访问
    this.viewService.create(user, document);
    const doc = lodash.omit(instanceToPlain(document), ['state']);
    const createUser = await this.userService.findById(doc.createUserId);
    return {
      document: { ...doc, views, createUser },
      authority: {
        ...authority,
        readable: [AuthEnum.creator, AuthEnum.admin, AuthEnum.member].includes(authority.auth),
        editable: [AuthEnum.creator, AuthEnum.admin].includes(authority.auth),
      },
    };
  }

  /**
   * 获取文档历史版本
   * @param user
   * @param documentId
   * @returns
   */
  public async getDocumentVersion(user: OutUser, documentId: string) {
    const data = await this.documentVersionService.getDocumentVersions(documentId);
    return data;
  }

  /**
   * 分享（或关闭分享）文档
   * @param id
   */
  async shareDocument(user: OutUser, documentId, dto: ShareDocumentDto, nextStatus = null) {
    const document = await this.documentRepo.findOne(documentId);
    await this.authService.canEdit(user.id, {
      organizationId: document.organizationId,
      wikiId: document.wikiId,
      documentId: document.id,
    });
    nextStatus = !nextStatus
      ? document.status === DocumentStatus.private
        ? DocumentStatus.public
        : DocumentStatus.private
      : nextStatus;
    const newData = await this.documentRepo.merge(document, {
      status: nextStatus,
      ...dto,
      sharePassword: dto.sharePassword || '',
    });
    const ret = await this.documentRepo.save(newData);
    return ret;
  }

  /**
   * 获取公开文档详情
   * @param documentId
   */
  async getPublicDocumentDetail(documentId, dto: ShareDocumentDto) {
    const document = await this.documentRepo.findOne(documentId);

    if (document.sharePassword && !dto.sharePassword) {
      throw new HttpException('输入密码后查看内容', HttpStatus.BAD_REQUEST);
    }

    if (document.sharePassword && document.sharePassword !== dto.sharePassword) {
      throw new HttpException('密码错误，请重新输入', HttpStatus.BAD_REQUEST);
    }

    const doc = lodash.omit(document, ['state']);
    const [views, createUser, wiki] = await Promise.all([
      this.viewService.getDocumentTotalViews(documentId),
      this.userService.findById(document.createUserId),
      this.wikiService.getPublicWikiDetail(document.wikiId),
    ]);
    // 异步创建
    this.viewService.create(null, document);

    return { ...doc, views, wiki, createUser };
  }

  /**
   * 获取子文档
   * @param user
   * @param data
   * @returns
   */
  public async getChildrenDocuments(
    user: OutUser,
    data: {
      wikiId: string;
      documentId?: string;
    }
  ) {
    const { wikiId, documentId } = data;

    const document = documentId
      ? await this.documentRepo.findOne(documentId)
      : await this.documentRepo.findOne({ wikiId, isWikiHome: true });

    await this.authService.canView(user.id, {
      organizationId: document.organizationId,
      wikiId: document.wikiId,
      documentId: document.id,
    });

    let unSortDocuments = [];

    if (document.isWikiHome) {
      unSortDocuments = await this.documentRepo.find({
        wikiId: document.wikiId,
        parentDocumentId: null,
        isWikiHome: false,
      });
    } else {
      unSortDocuments = await this.documentRepo.find({
        wikiId: document.wikiId,
        parentDocumentId: documentId,
        isWikiHome: false,
      });
    }

    const documents = await this.documentRepo.findByIds(
      unSortDocuments.map((d) => d.id),
      {
        order: { createdAt: 'ASC' },
      }
    );

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

    docs.sort((a, b) => a.index - b.index);

    return docs;
  }

  async getShareChildrenDocuments(data: { wikiId: string; documentId?: string }) {
    const { wikiId, documentId } = data;

    const document = documentId
      ? await this.documentRepo.findOne(documentId)
      : await this.documentRepo.findOne({ wikiId, isWikiHome: true });

    let unSortDocuments = [];

    if (document.isWikiHome) {
      unSortDocuments = await this.documentRepo.find({
        wikiId: document.wikiId,
        parentDocumentId: null,
        status: DocumentStatus.public,
        isWikiHome: false,
      });
    } else {
      unSortDocuments = await this.documentRepo.find({
        wikiId: document.wikiId,
        parentDocumentId: documentId,
        status: DocumentStatus.public,
        isWikiHome: false,
      });
    }

    const documents = await this.documentRepo.findByIds(
      unSortDocuments.map((d) => d.id),
      {
        order: { createdAt: 'ASC' },
      }
    );

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

    docs.sort((a, b) => a.index - b.index);

    return docs;
  }

  /**
   * 获取用户最近访问的10篇文档
   * @param user
   * @param dto
   * @returns
   */
  public async getRecentDocuments(user: OutUser, organizationId) {
    await this.authService.canView(user.id, {
      organizationId: organizationId,
      wikiId: null,
      documentId: null,
    });

    const records = await this.viewService.getUserRecentVisitedDocuments(user.id, organizationId);
    const documentIds = records.map((r) => r.documentId);
    const visitedAtMap = records.reduce((a, c) => {
      a[c.documentId] = c.visitedAt;
      return a;
    }, {});

    const ret = await Promise.all(
      documentIds.map(async (documentId) => {
        const doc = await this.findById(documentId);

        if (!doc) {
          return null;
        }

        const [views, createUser] = await Promise.all([
          await this.viewService.getDocumentTotalViews(documentId),
          await this.userService.findById(doc.createUserId),
        ]);

        const optimizedDoc = lodash.omit(doc, ['state', 'content', 'index', 'createUserId']);

        return {
          ...optimizedDoc,
          views,
          visitedAt: visitedAtMap[documentId],
          createUser,
        };
      })
    );

    return ret.filter(Boolean);
  }

  /**
   * 关键词搜索文档
   * @param keyword
   */
  async search(user, organizationId, keyword) {
    const res = await this.documentRepo
      .createQueryBuilder('document')
      .andWhere('document.organizationId = :organizationId')
      .andWhere('document.title LIKE :keyword')
      // FIXME: 编辑器内容的 json 字段可能也被匹配
      .orWhere('document.content LIKE :keyword')
      .setParameter('organizationId', organizationId)
      .setParameter('keyword', `%${keyword}%`)
      .getMany();

    // const ret = await Promise.all(
    //   res.map(async (doc) => {
    //     const auth = await this.documentUserRepo.findOne({
    //       documentId: doc.id,
    //       userId: user.id,
    //     });
    //     return auth && auth.readable ? doc : null;
    //   })
    // );

    // const data = ret.filter(Boolean);

    return res;
  }
}
