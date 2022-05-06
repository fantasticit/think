import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { EMPTY_DOCUMNENT } from '@think/constants';
import { DocumentStatus, IDocument, WikiUserRole } from '@think/domains';
import { DocumentAuthorityEntity } from '@entities/document-authority.entity';
import { DocumentEntity } from '@entities/document.entity';
import { OutUser, UserService } from '@services/user.service';
import { WikiService } from '@services/wiki.service';
import { MessageService } from '@services/message.service';
import { CollaborationService } from '@services/collaboration.service';
import { DocumentVersionService } from '@services/document-version.service';
import { TemplateService } from '@services/template.service';
import { ViewService } from '@services/view.service';
import { DocAuthDto } from '@dtos/doc-auth.dto';
import { CreateDocumentDto } from '@dtos/create-document.dto';
import { UpdateDocumentDto } from '@dtos/update-document.dto';
import { ShareDocumentDto } from '@dtos/share-document.dto';

@Injectable()
export class DocumentService {
  private collaborationService: CollaborationService;
  private documentVersionService: DocumentVersionService;

  constructor(
    @InjectRepository(DocumentAuthorityEntity)
    public readonly documentAuthorityRepo: Repository<DocumentAuthorityEntity>,

    @InjectRepository(DocumentEntity)
    public readonly documentRepo: Repository<DocumentEntity>,

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
    this.documentVersionService = new DocumentVersionService();
    this.collaborationService = new CollaborationService(
      this.userService,
      this,
      this.templateService,
      this.documentVersionService
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

  /**
   * 获取用户在指定文档的权限
   * @param documentId
   * @param userId
   * @returns
   */
  public async getDocumentAuthority(documentId: string, userId: string) {
    const authority = await this.documentAuthorityRepo.findOne({
      documentId,
      userId,
    });
    return authority;
  }

  /**
   * 操作文档成员权限（可读、可编辑）
   * @param param0
   * @returns
   */
  async operateDocumentAuth({ currentUserId, documentId, targetUserId, readable = false, editable = false }) {
    const doc = await this.documentRepo.findOne({ id: documentId });
    if (!doc) {
      throw new HttpException('文档不存在', HttpStatus.BAD_REQUEST);
    }

    const isCurrentUserCreator = currentUserId === doc.createUserId;
    const isTargetUserCreator = targetUserId === doc.createUserId;

    if (!isCurrentUserCreator) {
      throw new HttpException('您不是文档创建者，无权操作', HttpStatus.FORBIDDEN);
    }

    const targetUser = await this.userService.findOne(targetUserId);
    const targetDocAuth = await this.documentAuthorityRepo.findOne({
      documentId,
      userId: targetUserId,
    });

    if (!targetDocAuth) {
      const documentUser = {
        documentId,
        createUserId: doc.createUserId,
        wikiId: doc.wikiId,
        userId: targetUserId,
        readable: isTargetUserCreator ? true : editable ? true : readable,
        editable: isTargetUserCreator ? true : editable,
      };
      const res = await this.documentAuthorityRepo.create(documentUser);
      const ret = await this.documentAuthorityRepo.save(res);

      await this.messageService.notify(targetUser, {
        title: `您已被添加到文档「${doc.title}」`,
        message: `您已被添加到文档「${doc.title}」，快去看看！`,
        url: `/wiki/${doc.wikiId}/document/${doc.id}`,
      });

      return ret;
    } else {
      const newData = {
        ...targetDocAuth,
        readable: isTargetUserCreator ? true : editable ? true : readable,
        editable: isTargetUserCreator ? true : editable,
      };
      const res = await this.documentAuthorityRepo.merge(targetDocAuth, newData);
      const ret = await this.documentAuthorityRepo.save(res);

      await this.messageService.notify(targetUser, {
        title: `您在文档「${doc.title}」的权限已变更`,
        message: `您在文档「${doc.title}」的权限已变更，快去看看！`,
        url: `/wiki/${doc.wikiId}/document/${doc.id}`,
      });

      return ret;
    }
  }

  /**
   * 添加文档成员
   * @param user
   * @param documentId
   * @param dto
   * @returns
   */
  async addDocUser(user: OutUser, dto: DocAuthDto) {
    const doc = await this.documentRepo.findOne(dto.documentId);
    const targetUser = await this.userService.findOne({ name: dto.userName });

    if (!targetUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    await this.wikiService.addWikiUser(user, doc.wikiId, {
      userName: targetUser.name,
      userRole: WikiUserRole.normal,
    });

    return await this.operateDocumentAuth({
      currentUserId: user.id,
      documentId: dto.documentId,
      targetUserId: targetUser.id,
      readable: dto.readable,
      editable: dto.editable,
    });
  }

  /**
   * 修改文档成员
   * @param user
   * @param documentId
   * @param dto
   * @returns
   */
  async updateDocUser(user: OutUser, dto: DocAuthDto): Promise<DocumentAuthorityEntity> {
    const targetUser = await this.userService.findOne({ name: dto.userName });
    return this.operateDocumentAuth({
      currentUserId: user.id,
      documentId: dto.documentId,
      targetUserId: targetUser.id,
      readable: dto.readable,
      editable: dto.editable,
    });
  }

  /**
   * 删除文档成员
   * @param user
   * @param documentId
   * @param dto
   * @returns
   */
  async deleteDocUser(user: OutUser, dto: DocAuthDto): Promise<void> {
    const doc = await this.documentRepo.findOne({ id: dto.documentId });
    const targetUser = await this.userService.findOne({ name: dto.userName });

    if (targetUser.id === doc.createUserId) {
      throw new HttpException('无法删除文档创建者', HttpStatus.FORBIDDEN);
    }

    const targetDocAuth = await this.documentAuthorityRepo.findOne({
      documentId: dto.documentId,
      userId: targetUser.id,
    });

    await this.messageService.notify(targetUser, {
      title: `您已被移出文档「${doc.title}」`,
      message: `${user.name}已将您从文档「${doc.title}」移出！`,
      url: `/wiki/${doc.wikiId}/document/${doc.id}`,
    });

    await this.documentAuthorityRepo.remove(targetDocAuth);
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

    const auth = await this.getDocumentAuthority(documentId, user.id);

    if (!auth.readable) {
      throw new HttpException('您无权查看', HttpStatus.FORBIDDEN);
    }

    const data = await this.documentAuthorityRepo.find({ documentId });

    return await Promise.all(
      data.map(async (auth) => {
        const user = await this.userService.findById(auth.userId);
        return { auth, user };
      })
    );
  }

  /**
   * 创建文档
   * @param user
   * @param dto
   * @param isWikiHome 知识库首页文档
   * @returns
   */
  public async createDocument(user: OutUser, dto: CreateDocumentDto, isWikiHome = false) {
    await this.wikiService.getWikiUserDetail({
      wikiId: dto.wikiId,
      userId: user.id,
    });

    const [docs] = await this.documentRepo.findAndCount({ createUserId: user.id });
    const maxIndex = docs.length
      ? Math.max.apply(
          [],
          docs.map((doc) => +doc.index)
        )
      : -1;

    const data = {
      ...dto,
      createUserId: user.id,
      isWikiHome,
      title: '未命名文档',
      index: maxIndex + 1,
      ...EMPTY_DOCUMNENT,
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

    const res = await this.documentRepo.create(data);
    const document = await this.documentRepo.save(res);

    // 知识库成员权限继承
    const wikiUsers = await this.wikiService.getWikiUsers(dto.wikiId);

    await Promise.all([
      await this.operateDocumentAuth({
        currentUserId: user.id,
        documentId: document.id,
        targetUserId: user.id,
        readable: true,
        editable: true,
      }),
      ...wikiUsers.map(async (wikiUser) => {
        await this.operateDocumentAuth({
          currentUserId: user.id,
          documentId: document.id,
          targetUserId: wikiUser.userId,
          readable: true,
          editable: wikiUser.userRole === WikiUserRole.admin,
        });
      }),
    ]);

    return instanceToPlain(res);
  }

  /**
   * 删除知识库下所有文档
   * @param user
   * @param wikiId
   */
  async deleteWikiDocuments(user, wikiId) {
    const docs = await this.documentRepo.find({ wikiId });
    await Promise.all(
      docs.map((doc) => {
        return this.deleteDocument(user, doc.id);
      })
    );
  }

  /**
   * 删除文档
   * @param idd
   */
  async deleteDocument(user: OutUser, documentId) {
    const document = await this.documentRepo.findOne(documentId);
    if (document.isWikiHome) {
      throw new HttpException('该文档作为知识库首页使用，无法删除', HttpStatus.FORBIDDEN);
    }
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
    const auths = await this.documentAuthorityRepo.find({ documentId });
    await this.documentAuthorityRepo.remove(auths);
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
  public async getDocumentDetail(user: OutUser, documentId: string, userAgent) {
    // 1. 记录访问
    await this.viewService.create({ userId: user.id, documentId, userAgent });
    // 2. 查询文档
    const document = await this.documentRepo.findOne(documentId);
    // 3. 查询权限
    const authority = await this.documentAuthorityRepo.findOne({
      documentId,
      userId: user.id,
    });
    // 4. 查询访问
    const views = await this.viewService.getDocumentTotalViews(documentId);
    // 5. 生成响应
    const doc = instanceToPlain(document);
    const createUser = await this.userService.findById(doc.createUserId);
    return { document: { ...doc, views, createUser }, authority };
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
    nextStatus = !nextStatus
      ? document.status === DocumentStatus.private
        ? DocumentStatus.public
        : DocumentStatus.private
      : nextStatus;
    const newData = await this.documentRepo.merge(document, {
      status: nextStatus,
      ...dto,
    });
    const ret = await this.documentRepo.save(newData);
    return ret;
  }

  /**
   * 获取公开文档详情
   * @param documentId
   */
  async getPublicDocumentDetail(documentId, dto: ShareDocumentDto, userAgent) {
    const document = await this.documentRepo.findOne(documentId);

    if (document.sharePassword && !dto.sharePassword) {
      throw new HttpException('输入密码后查看内容', HttpStatus.BAD_REQUEST);
    }

    if (document.sharePassword !== dto.sharePassword) {
      throw new HttpException('密码错误，请重新输入', HttpStatus.BAD_REQUEST);
    }

    await this.viewService.create({ userId: 'public', documentId, userAgent });
    const views = await this.viewService.getDocumentTotalViews(documentId);
    const createUser = await this.userService.findById(document.createUserId);
    const wiki = await this.wikiService.getPublicWikiDetail(document.wikiId);

    return { ...document, views, wiki, createUser };
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

    documents.forEach((doc) => {
      delete doc.state;
    });

    const docs = documents
      .filter((doc) => !doc.isWikiHome)
      .map((doc) => {
        const res = instanceToPlain(doc);
        res.key = res.id;
        res.label = res.title;
        return res;
      });

    const docsWithCreateUser = await Promise.all(
      docs.map(async (doc) => {
        const createUser = await this.userService.findById(doc.createUserId);
        return { ...doc, createUser };
      })
    );

    return docsWithCreateUser;
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

    documents.forEach((doc) => {
      delete doc.state;
    });

    const docs = documents
      .filter((doc) => !doc.isWikiHome)
      .map((doc) => {
        const res = instanceToPlain(doc);
        res.key = res.id;
        res.label = res.title;
        return res;
      });

    const docsWithCreateUser = await Promise.all(
      docs.map(async (doc) => {
        const createUser = await this.userService.findById(doc.createUserId);
        return { ...doc, createUser };
      })
    );

    return docsWithCreateUser;
  }

  /**
   * 获取用户最近更新的10篇文档
   * @param user
   * @param dto
   * @returns
   */
  public async getRecentDocuments(user: OutUser) {
    const query = await this.documentAuthorityRepo
      .createQueryBuilder('documentAuth')
      .where('documentAuth.userId=:userId')
      .andWhere('documentAuth.readable=:readable')
      .setParameter('userId', user.id)
      .setParameter('readable', 1);

    query.orderBy('documentAuth.updatedAt', 'DESC');

    query.take(20);

    const documentIds = await (await query.getMany()).map((docAuth) => docAuth.documentId);
    const documents = await this.documentRepo.findByIds(documentIds, { order: { updatedAt: 'DESC' } });
    const docs = documents.filter((doc) => !doc.isWikiHome).map((doc) => instanceToPlain(doc));

    const res = await Promise.all(
      docs.map(async (doc) => {
        const views = await this.viewService.getDocumentTotalViews(doc.id);
        return { ...doc, views } as IDocument & { views: number };
      })
    );

    const withCreateUserRes = await Promise.all(
      res.map(async (doc) => {
        const createUser = await this.userService.findById(doc.createUserId);
        return { createUser, ...doc };
      })
    );

    return withCreateUserRes;
  }

  /**
   * 关键词搜索文档
   * @param keyword
   */
  async search(user, keyword) {
    const res = await this.documentRepo
      .createQueryBuilder('document')
      .where('document.title LIKE :keyword')
      .setParameter('keyword', `%${keyword}%`)
      .getMany();

    const ret = await Promise.all(
      res.map(async (doc) => {
        const auth = await this.documentAuthorityRepo.findOne({
          documentId: doc.id,
          userId: user.id,
        });
        return auth && auth.readable ? doc : null;
      })
    );

    const data = ret.filter(Boolean);

    const withCreateUserRes = await Promise.all(
      data.map(async (doc) => {
        const createUser = await this.userService.findById(doc.createUserId);
        return { createUser, ...doc };
      })
    );

    return withCreateUserRes;
  }
}
