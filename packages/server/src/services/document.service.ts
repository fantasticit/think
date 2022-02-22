import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { DocumentStatus, WikiUserRole } from '@think/share';
import { DocumentAuthorityEntity } from '@entities/document-authority.entity';
import { DocumentEntity } from '@entities/document.entity';
import { OutUser, UserService } from '@services/user.service';
import { WikiService } from '@services/wiki.service';
import { MessageService } from '@services/message.service';
import { CollaborationService } from '@services/collaboration.service';
import { TemplateService } from '@services/template.service';
import { ViewService } from '@services/view.service';
import { array2tree } from '@helpers/tree.helper';
import { DocAuthDto } from '@dtos/doc-auth.dto';
import { CreateDocumentDto } from '@dtos/create-document.dto';
import { UpdateDocumentDto } from '@dtos/update-document.dto';
import { ShareDocumentDto } from '@dtos/share-document.dto';

const DOCUMENT_PLACEHOLDERS = [
  {
    content: JSON.stringify({
      default: {
        type: 'doc',
        content: [
          { type: 'title', content: [{ type: 'text', text: '未命名文档' }] },
          {
            type: 'paragraph',
            attrs: { textAlign: 'left', indent: 0 },
            content: [{ type: 'text', text: '在此编辑正文...' }],
          },
        ],
      },
    }),
    state: Buffer.from(
      new Uint8Array([
        3, 3, 221, 238, 169, 254, 11, 0, 40, 0, 150, 148, 219, 254, 3, 88, 6,
        105, 110, 100, 101, 110, 116, 1, 125, 0, 7, 0, 215, 168, 212, 201, 8, 1,
        6, 4, 0, 221, 238, 169, 254, 11, 1, 15, 230, 156, 170, 229, 145, 189,
        229, 144, 141, 230, 150, 135, 230, 161, 163, 2, 215, 168, 212, 201, 8,
        0, 0, 1, 71, 150, 148, 219, 254, 3, 0, 3, 5, 116, 105, 116, 108, 101,
        15, 150, 148, 219, 254, 3, 0, 1, 1, 7, 100, 101, 102, 97, 117, 108, 116,
        1, 0, 23, 129, 150, 148, 219, 254, 3, 0, 1, 0, 63, 199, 150, 148, 219,
        254, 3, 0, 150, 148, 219, 254, 3, 24, 3, 9, 112, 97, 114, 97, 103, 114,
        97, 112, 104, 40, 0, 150, 148, 219, 254, 3, 88, 9, 116, 101, 120, 116,
        65, 108, 105, 103, 110, 1, 119, 4, 108, 101, 102, 116, 1, 0, 150, 148,
        219, 254, 3, 88, 1, 0, 7, 71, 150, 148, 219, 254, 3, 90, 6, 1, 0, 150,
        148, 219, 254, 3, 98, 6, 132, 150, 148, 219, 254, 3, 104, 6, 229, 156,
        168, 230, 173, 164, 129, 150, 148, 219, 254, 3, 106, 7, 132, 150, 148,
        219, 254, 3, 113, 6, 231, 188, 150, 232, 190, 145, 129, 150, 148, 219,
        254, 3, 115, 32, 132, 150, 148, 219, 254, 3, 147, 1, 9, 230, 173, 163,
        230, 150, 135, 46, 46, 46, 2, 150, 148, 219, 254, 3, 5, 0, 88, 90, 8,
        99, 6, 107, 7, 116, 32, 215, 168, 212, 201, 8, 1, 0, 1,
      ]),
    ),
  },
];

@Injectable()
export class DocumentService {
  private collaborationService: CollaborationService;

  constructor(
    @InjectRepository(DocumentAuthorityEntity)
    private readonly documentAuthorityRepo: Repository<DocumentAuthorityEntity>,
    @InjectRepository(DocumentEntity)
    private readonly documentRepo: Repository<DocumentEntity>,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => WikiService))
    private readonly wikiService: WikiService,
    @Inject(forwardRef(() => TemplateService))
    private readonly templateService: TemplateService,
    @Inject(forwardRef(() => ViewService))
    private readonly viewService: ViewService,
  ) {
    this.collaborationService = new CollaborationService(
      this.userService,
      this,
      this.templateService,
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
  async operateDocumentAuth({
    currentUserId,
    documentId,
    targetUserId,
    readable = false,
    editable = false,
  }) {
    const doc = await this.documentRepo.findOne({ id: documentId });
    if (!doc) {
      throw new HttpException('文档不存在', HttpStatus.BAD_REQUEST);
    }

    const isCurrentUserCreator = currentUserId === doc.createUserId;
    const isTargetUserCreator = targetUserId === doc.createUserId;

    if (!isCurrentUserCreator) {
      throw new HttpException(
        '您不是文档创建者，无权操作',
        HttpStatus.FORBIDDEN,
      );
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
      const res = await this.documentAuthorityRepo.merge(
        targetDocAuth,
        newData,
      );
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
    if (!doc) {
      throw new HttpException('文档不存在', HttpStatus.BAD_REQUEST);
    }

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
  async updateDocUser(
    user: OutUser,
    dto: DocAuthDto,
  ): Promise<DocumentAuthorityEntity> {
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
    if (!doc) {
      throw new HttpException('文档不存在', HttpStatus.BAD_REQUEST);
    }

    const isCurrentUserCreator = user.id === doc.createUserId;

    if (!isCurrentUserCreator) {
      throw new HttpException('您无权限进行该操作', HttpStatus.FORBIDDEN);
    }

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
      message: `管理员已将您从文档「${doc.title}」移出！`,
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
      }),
    );
  }

  /**
   * 创建文档
   * @param user
   * @param dto
   * @param isWikiHome 知识库首页文档
   * @returns
   */
  public async createDocument(
    user: OutUser,
    dto: CreateDocumentDto,
    isWikiHome = false,
  ) {
    await this.wikiService.getWikiUserDetail({
      wikiId: dto.wikiId,
      userId: user.id,
    });

    const data = {
      ...dto,
      createUserId: user.id,
      isWikiHome,
      title: '未命名文档',
      // content: '',
      // state: Buffer.from(new Uint8Array()),
      ...DOCUMENT_PLACEHOLDERS[0],
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
    const wikiUsers = await this.wikiService.getWikiUsers(
      { userId: user.id, wikiId: dto.wikiId },
      true,
    );

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
      }),
    );
  }

  /**
   * 删除文档
   * @param idd
   */
  async deleteDocument(user: OutUser, documentId) {
    const document = await this.documentRepo.findOne(documentId);
    if (!document) {
      throw new HttpException('文档不存在', HttpStatus.NOT_FOUND);
    }
    if (document.createUserId !== user.id) {
      throw new HttpException(
        '您不是该文档的创建者，无法删除',
        HttpStatus.FORBIDDEN,
      );
    }
    if (document.isWikiHome) {
      throw new HttpException(
        '该文档作为知识库首页使用，无法删除',
        HttpStatus.FORBIDDEN,
      );
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
        }),
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
  public async updateDocument(
    user: OutUser,
    documentId: string,
    dto: UpdateDocumentDto,
  ) {
    const document = await this.documentRepo.findOne(documentId);
    if (!document) {
      throw new HttpException('文档不存在', HttpStatus.NOT_FOUND);
    }
    const authority = await this.documentAuthorityRepo.findOne({
      documentId,
      userId: user.id,
    });
    if (!authority || !authority.editable) {
      throw new HttpException('您无权编辑此文档', HttpStatus.FORBIDDEN);
    }
    const res = await this.documentRepo.create({ ...document, ...dto });
    const ret = await this.documentRepo.save(res);
    return instanceToPlain(ret);
  }

  /**
   * 获取知识库首页文档
   * @param user
   * @param wikiId
   * @returns
   */
  async getWikiHomeDocument(user: OutUser, wikiId) {
    const res = await this.documentRepo.findOne({ wikiId, isWikiHome: true });
    return instanceToPlain(res);
  }

  /**
   * 获取公开知识库首页文档
   * @param user
   * @param wikiId
   * @returns
   */
  async getWikiPublicHomeDocument(wikiId, userAgent) {
    const res = await this.documentRepo.findOne({ wikiId, isWikiHome: true });
    await this.viewService.create({
      userId: 'public',
      documentId: res.id,
      userAgent,
    });
    const views = await this.viewService.getDocumentTotalViews(res.id);
    return { ...instanceToPlain(res), views };
  }

  /**
   * 获取文档详情
   * @param user
   * @param documentId
   * @returns
   */
  public async getDocumentDetail(user: OutUser, documentId: string, userAgent) {
    const document = await this.documentRepo.findOne(documentId);

    if (!document) {
      throw new HttpException('文档不存在', HttpStatus.NOT_FOUND);
    }

    const authority = await this.documentAuthorityRepo.findOne({
      documentId,
      userId: user.id,
    });

    if (!authority || !authority.readable) {
      throw new HttpException('您无权查看此文档', HttpStatus.FORBIDDEN);
    }

    await this.viewService.create({ userId: user.id, documentId, userAgent });
    const views = await this.viewService.getDocumentTotalViews(documentId);

    const doc = instanceToPlain(document);
    const createUser = await this.userService.findById(doc.createUserId);

    return { document: { ...doc, views, createUser }, authority };
  }

  /**
   * 分享（或关闭分享）文档
   * @param id
   */
  async shareDocument(
    user: OutUser,
    documentId,
    dto: ShareDocumentDto,
    nextStatus = null,
  ) {
    const document = await this.documentRepo.findOne(documentId);
    if (!document) {
      throw new HttpException('文档不存在', HttpStatus.NOT_FOUND);
    }

    const authority = await this.documentAuthorityRepo.findOne({
      documentId,
      userId: user.id,
    });

    if (!authority || !authority.editable) {
      throw new HttpException('您无权编辑此文档', HttpStatus.FORBIDDEN);
    }

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

    if (!document) {
      throw new HttpException('文档不存在', HttpStatus.NOT_FOUND);
    }

    if (document.status !== DocumentStatus.public) {
      throw new HttpException('私有文档，无法查看内容', HttpStatus.FORBIDDEN);
    }

    if (document.sharePassword && !dto.sharePassword) {
      throw new HttpException('输入密码后查看内容', HttpStatus.BAD_REQUEST);
    }

    if (document.sharePassword !== dto.sharePassword) {
      throw new HttpException('密码错误，请重新输入', HttpStatus.BAD_REQUEST);
    }

    await this.viewService.create({ userId: 'public', documentId, userAgent });
    const views = await this.viewService.getDocumentTotalViews(documentId);
    const createUser = await this.userService.findById(document.createUserId);

    return { ...document, views, createUser };
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
    },
  ) {
    const { wikiId, documentId } = data;

    const document = documentId
      ? await this.documentRepo.findOne(documentId)
      : await this.documentRepo.findOne({ wikiId, isWikiHome: true });

    if (!document) {
      throw new HttpException('文档不存在', HttpStatus.NOT_FOUND);
    }

    let unSortDocuments = [];

    const authority = await this.documentAuthorityRepo.findOne({
      documentId: document.id,
      userId: user.id,
    });

    if (!authority || !authority.readable) {
      throw new HttpException(
        '您无权查看该文档下的子文档',
        HttpStatus.FORBIDDEN,
      );
    }

    if (document.isWikiHome) {
      unSortDocuments = await this.documentRepo.find({
        wikiId: document.wikiId,
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
      },
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
      }),
    );

    return docsWithCreateUser;
  }

  async getShareChildrenDocuments(data: {
    wikiId: string;
    documentId?: string;
  }) {
    const { wikiId, documentId } = data;

    const document = documentId
      ? await this.documentRepo.findOne(documentId)
      : await this.documentRepo.findOne({ wikiId, isWikiHome: true });

    if (!document) {
      throw new HttpException('文档不存在', HttpStatus.NOT_FOUND);
    }

    let unSortDocuments = [];

    if (document.status !== DocumentStatus.public) {
      throw new HttpException('私有文档，无法查看内容', HttpStatus.FORBIDDEN);
    }

    if (document.isWikiHome) {
      unSortDocuments = await this.documentRepo.find({
        wikiId: document.wikiId,
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
      },
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
      }),
    );

    return docsWithCreateUser;
  }

  /**
   * 获取知识库的文档目录
   * @param user
   * @param dto
   * @returns
   */
  public async getWikiTocs(user: OutUser, wikiId: string) {
    await this.wikiService.getWikiDetail(user, wikiId);
    // @ts-ignore
    const records = await this.documentAuthorityRepo.find({
      userId: user.id,
      wikiId,
    });

    const ids = records.map((record) => record.documentId);
    const documents = await this.documentRepo.findByIds(ids, {
      order: { createdAt: 'ASC' },
    });
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
      }),
    );

    return array2tree(docsWithCreateUser);
  }

  /**
   * 重排知识库目录
   * @param user
   * @param wikiId
   * @param relations
   */
  public async orderWikiTocs(
    user: OutUser,
    wikiId: string,
    relations: Array<{ id: string; parentDocumentId?: string }>,
  ) {
    await this.wikiService.getWikiDetail(user, wikiId);
    await Promise.all(
      relations.map(async (relation) => {
        const { id, parentDocumentId } = relation;
        const doc = await this.documentRepo.findOne(id);

        if (doc) {
          const newData = await this.documentRepo.merge(doc, {
            parentDocumentId,
          });
          await this.documentRepo.save(newData);
        }
      }),
    );
  }

  /**
   * 获取知识库公开的文档目录
   * @param user
   * @param dto
   * @returns
   */
  public async getPublicWikiTocs(wikiId: string) {
    await this.wikiService.getPublicWikiDetail(wikiId);
    // @ts-ignore
    const unSortDocuments = await this.documentRepo.find({
      wikiId,
      status: DocumentStatus.public,
    });

    const documents = await this.documentRepo.findByIds(
      unSortDocuments.map((d) => d.id),
      {
        order: { createdAt: 'ASC' },
      },
    );

    const docs = documents
      .filter((doc) => !doc.isWikiHome)
      .map((doc) => {
        const res = instanceToPlain(doc);
        res.key = res.id;
        res.label = res.title;
        return res;
      });

    docs.forEach((doc) => {
      delete doc.state;
    });

    return array2tree(docs.map((doc) => instanceToPlain(doc)));
  }

  /**
   * 获取知识库所有的文档
   * @param user
   * @param dto
   * @returns
   */
  public async getWikiDocs(user: OutUser, wikiId: string) {
    this.wikiService.getWikiDetail(user, wikiId);
    const records = await this.documentAuthorityRepo.find({
      userId: user.id,
      wikiId,
    });
    const ids = records.map((record) => record.documentId);
    const documents = await this.documentRepo.findByIds(ids);
    documents.forEach((doc) => {
      delete doc.state;
    });

    const docs = documents
      .filter((doc) => !doc.isWikiHome)
      .map((doc) => {
        const res = instanceToPlain(doc);
        res.key = res.id;
        return res;
      });

    const docsWithCreateUser = await Promise.all(
      docs.map(async (doc) => {
        const createUser = await this.userService.findById(doc.createUserId);
        return { ...doc, createUser };
      }),
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
    const query = await this.documentRepo
      .createQueryBuilder('document')
      .where('document.createUserId=:createUserId')
      .andWhere('document.isWikiHome=:isWikiHome')
      .setParameter('createUserId', user.id)
      .setParameter('isWikiHome', 0);
    query.orderBy('document.updatedAt', 'DESC');
    query.take(10);
    const documents = await query.getMany();

    const docs = documents.map((doc) => instanceToPlain(doc));

    const res = await Promise.all(
      docs.map(async (doc) => {
        const views = await this.viewService.getDocumentTotalViews(doc.id);
        return { ...doc, views };
      }),
    );

    return res;
  }
}
