import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  WikiStatus,
  WikiUserRole,
  DocumentStatus,
  Pagination,
  CollectType,
} from '@think/share';
import { WikiEntity } from '@entities/wiki.entity';
import { WikiUserEntity } from '@entities/wiki-user.entity';
import { UserService } from '@services/user.service';
import { MessageService } from '@services/message.service';
import { CollectorService } from '@services/collector.service';
import { OutUser } from '@services/user.service';
import { DocumentService } from '@services/document.service';
import { WikiUserDto } from '@dtos/wiki-user.dto';
import { CreateWikiDto } from '@dtos/create-wiki.dto';
import { UpdateWikiDto } from '@dtos/update-wiki.dto';
import { ShareWikiDto } from '@dtos/share-wiki.dto';

@Injectable()
export class WikiService {
  constructor(
    @InjectRepository(WikiEntity)
    private readonly wikiRepo: Repository<WikiEntity>,
    @InjectRepository(WikiUserEntity)
    private readonly wikiUserRepo: Repository<WikiUserEntity>,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
    @Inject(forwardRef(() => CollectorService))
    private readonly collectorService: CollectorService,
    @Inject(forwardRef(() => DocumentService))
    private readonly documentService: DocumentService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

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
   * 操作知识库成员（添加、修改角色）
   * @param param0
   * @returns
   */
  async operateWikiUser({
    wikiId,
    currentUserId,
    targetUserId,
    targetUserRole,
  }) {
    const wiki = await this.wikiRepo.findOne(wikiId);

    // 1. 检查知识库
    if (!wiki) {
      throw new HttpException('目标知识库不存在', HttpStatus.BAD_REQUEST);
    }

    const isCurrentUserCreator = currentUserId === wiki.createUserId;
    const isTargetUserCreator = targetUserId === wiki.createUserId;

    const currentWikiUserRole = isCurrentUserCreator
      ? WikiUserRole.admin
      : (
          await this.wikiUserRepo.findOne({
            wikiId: wiki.id,
            userId: currentUserId,
          })
        ).userRole;

    // 2. 检查成员是否存在
    const targetUser = await this.userService.findOne(targetUserId);
    const targetWikiUser = await this.wikiUserRepo.findOne({
      wikiId: wiki.id,
      userId: targetUserId,
    });

    if (targetWikiUser) {
      if (targetWikiUser.userRole === targetUserRole) return;

      // 2.1 修改知识库用户角色
      if (targetUserRole === WikiUserRole.admin) {
        if (currentWikiUserRole !== WikiUserRole.admin) {
          throw new HttpException('您无权限进行该操作', HttpStatus.FORBIDDEN);
        }
      }
      const userRole = isTargetUserCreator
        ? WikiUserRole.admin
        : targetUserRole;
      const newData = {
        ...targetWikiUser,
        userRole,
      };
      const res = await this.wikiUserRepo.merge(targetWikiUser, newData);
      const ret = await this.wikiUserRepo.save(res);
      await this.messageService.notify(targetUser, {
        title: `您在「${wiki.name}」的权限已变更`,
        message: `您在「${wiki.name}」的权限已变更，快去看看吧！`,
        url: `/wiki/${wiki.id}`,
      });
      return ret;
    } else {
      // 2.2. 添加知识库新用户
      if (currentWikiUserRole !== WikiUserRole.admin) {
        throw new HttpException('您无权限进行该操作', HttpStatus.FORBIDDEN);
      }
      const data = {
        wikiId,
        createUserId: wiki.createUserId,
        userId: targetUserId,
        userRole: isTargetUserCreator ? WikiUserRole.admin : targetUserRole,
      };
      const res = await this.wikiUserRepo.create(data);
      const ret = await this.wikiUserRepo.save(res);
      await this.messageService.notify(targetUser, {
        title: `您被添加到知识库「${wiki.name}」`,
        message: `您被添加到知识库「${wiki.name}」，快去看看吧！`,
        url: `/wiki/${wiki.id}`,
      });
      return ret;
    }
  }

  /**
   * 添加知识库成员
   * @param user
   * @param wikiId
   * @param dto
   * @returns
   */
  async addWikiUser(
    user: OutUser,
    wikiId,
    dto: WikiUserDto,
  ): Promise<WikiUserEntity> {
    const targetUser = await this.userService.findOne({ name: dto.userName });

    if (!targetUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    const homeDoc = await this.getWikiHomeDocument(user, wikiId);
    await this.documentService.operateDocumentAuth({
      currentUserId: user.id,
      documentId: homeDoc.id,
      targetUserId: targetUser.id,
      readable: true,
      editable: dto.userRole === WikiUserRole.admin,
    });
    return this.operateWikiUser({
      wikiId,
      currentUserId: user.id,
      targetUserId: targetUser.id,
      targetUserRole: dto.userRole,
    });
  }

  /**
   * 修改知识库成员
   * @param user
   * @param wikiId
   * @param dto
   * @returns
   */
  async updateWikiUser(
    user: OutUser,
    wikiId,
    dto: WikiUserDto,
  ): Promise<WikiUserEntity> {
    const targetUser = await this.userService.findOne({ name: dto.userName });

    if (!targetUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    return this.operateWikiUser({
      wikiId,
      currentUserId: user.id,
      targetUserId: targetUser.id,
      targetUserRole: dto.userRole,
    });
  }

  /**
   * 删除知识库成员
   * @param user
   * @param wikiId
   * @param dto
   * @returns
   */
  async deleteWikiUser(user: OutUser, wikiId, dto: WikiUserDto): Promise<void> {
    const currentWikiUserRole = (
      await this.wikiUserRepo.findOne({
        wikiId,
        userId: user.id,
      })
    ).userRole;

    if (currentWikiUserRole !== WikiUserRole.admin) {
      throw new HttpException('您无权限进行该操作', HttpStatus.FORBIDDEN);
    }

    const targetUser = await this.userService.findOne({ name: dto.userName });

    if (!targetUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    const targetWikiUser = await this.wikiUserRepo.findOne({
      wikiId,
      userId: targetUser.id,
    });

    if (targetWikiUser.createUserId === targetWikiUser.userId) {
      throw new HttpException('无法删除知识库创建者', HttpStatus.FORBIDDEN);
    }

    const wiki = await this.wikiRepo.findOne(wikiId);

    await this.messageService.notify(targetUser, {
      title: `您已被移出知识库「${wiki.name}」`,
      message: `管理员已将您从知识库「${wiki.name}」移出！`,
      url: `/wiki/${wiki.id}`,
    });

    await this.wikiUserRepo.remove(targetWikiUser);
  }

  /**
   * 获取知识库成员
   * @param userId
   * @param wikiId
   * @param internalInvoke 是否为内部调用，内部调用忽略权限检查
   */
  async getWikiUsers({ userId, wikiId }, internalInvoke = false) {
    const currenWikiUser = await this.getWikiUserDetail({ userId, wikiId });

    if (currenWikiUser.userRole !== WikiUserRole.admin && !internalInvoke) {
      throw new HttpException('您无权限查看', HttpStatus.FORBIDDEN);
    }

    const records = await this.wikiUserRepo.find({ wikiId });
    const ids = records.map((record) => record.userId);
    const users = await this.userService.findByIds(ids);
    const res = users.map((user) => {
      const record = records.find((record) => record.userId === user.id);
      return {
        userId: user.id,
        userName: user.name,
        userRole: record.userRole,
        userStatus: record.userStatus,
        isCreator: record.createUserId === user.id,
        createdAt: record.createdAt,
      };
    });
    return res;
  }

  /**
   * 查询知识库指定用户详情
   * @param workspaceId
   * @param userId
   * @returns
   */
  async getWikiUserDetail({ wikiId, userId }): Promise<WikiUserEntity> {
    const data = { wikiId, userId };
    const wikiUser = await this.wikiUserRepo.findOne(data);
    if (!wikiUser) {
      throw new HttpException('您不在该知识库中', HttpStatus.FORBIDDEN);
    }
    return wikiUser;
  }

  /**
   * 创建知识库
   * @param user
   * @param dto CreateWikiDto
   * @returns
   */
  async createWiki(user: OutUser, dto: CreateWikiDto) {
    const createUserId = user.id;
    const data = {
      ...dto,
      createUserId,
    };
    const toSaveWiki = await this.wikiRepo.create(data);
    const wiki = await this.wikiRepo.save(toSaveWiki);
    await this.operateWikiUser({
      wikiId: wiki.id,
      currentUserId: user.id,
      targetUserId: createUserId,
      targetUserRole: WikiUserRole.admin,
    });
    // 知识库首页文档
    await this.documentService.createDocument(
      user,
      {
        wikiId: wiki.id,
        parentDocumentId: null,
        title: wiki.name,
      },
      true,
    );
    return wiki;
  }

  /**
   * 获取当前用户所有知识库
   * @param user
   * @param pagination
   * @returns
   */
  async getAllWikis(user: OutUser, pagination: Pagination) {
    const { page = 1, pageSize = 12 } = pagination;
    const query = await this.wikiUserRepo
      .createQueryBuilder('WikiUser')
      .where('WikiUser.userId=:userId')
      .setParameter('userId', user.id);
    query.skip((+page - 1) * +pageSize);
    query.take(+pageSize);
    const [wikis, total] = await query.getManyAndCount();
    const workspaceIds = wikis.map((wiki) => wiki.wikiId);
    const data = await this.wikiRepo.findByIds(workspaceIds);

    const ret = await Promise.all(
      data.map(async (wiki) => {
        const createUser = await this.userService.findById(wiki.createUserId);
        return { ...wiki, createUser };
      }),
    );

    return { data: ret, total };
  }

  /**
   * 获取当前用户创建的知识库
   * @param user
   * @param pagination
   * @returns
   */
  async getOwnWikis(user: OutUser, pagination: Pagination) {
    const { page = 1, pageSize = 12 } = pagination;
    const query = await this.wikiRepo
      .createQueryBuilder('wiki')
      .where('wiki.createUserId=:createUserId')
      .setParameter('createUserId', user.id);
    query.skip((+page - 1) * +pageSize);
    query.take(+pageSize);
    const [data, total] = await query.getManyAndCount();

    const ret = await Promise.all(
      data.map(async (wiki) => {
        const createUser = await this.userService.findById(wiki.createUserId);
        return { ...wiki, createUser };
      }),
    );

    return { data: ret, total };
  }

  /**
   * 获取当前用户参与的知识库
   * @param user
   * @param pagination
   * @returns
   */
  async getJoinWikis(user: OutUser, pagination: Pagination) {
    const { page = 1, pageSize = 12 } = pagination;
    const query = await this.wikiUserRepo
      .createQueryBuilder('WikiUser')
      .where('WikiUser.userId=:userId')
      .andWhere('WikiUser.createUserId!=:userId')
      .setParameter('userId', user.id);
    query.skip((+page - 1) * +pageSize);
    query.take(+pageSize);
    const [wikis, total] = await query.getManyAndCount();
    const workspaceIds = wikis.map((wiki) => wiki.wikiId);
    const data = await this.wikiRepo.findByIds(workspaceIds);

    const ret = await Promise.all(
      data.map(async (wiki) => {
        const createUser = await this.userService.findById(wiki.createUserId);
        return { ...wiki, createUser };
      }),
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
    const wikiUser = await this.wikiUserRepo.findOne({
      userId: user.id,
      wikiId,
    });

    if (!wikiUser) {
      throw new HttpException('您无权查看该知识库', HttpStatus.FORBIDDEN);
    }

    const wiki = await this.wikiRepo.findOne(wikiId);

    if (!wiki) {
      throw new HttpException('访问的知识库不存在', HttpStatus.NOT_FOUND);
    }

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
    await this.getWikiUserDetail({ wikiId, userId: user.id });
    return this.documentService.getWikiHomeDocument(user, wikiId);
  }

  /**
   * 获取公开知识库首页文档（首页文档由系统自动创建）
   * @param user
   * @param wikiId
   * @returns
   */
  async getWikiPublicHomeDocument(wikiId, userAgent) {
    const wiki = await this.wikiRepo.findOne(wikiId);

    if (!wiki) {
      throw new HttpException('目标知识库不存在', HttpStatus.NOT_FOUND);
    }

    if (wiki.status !== WikiStatus.public) {
      throw new HttpException('私有文档，无法查看内容', HttpStatus.FORBIDDEN);
    }

    return this.documentService.getWikiPublicHomeDocument(wikiId, userAgent);
  }

  /**
   * 获取公开知识库详情
   * @param wikiId
   * @returns
   */
  async getPublicWikiDetail(wikiId: string) {
    const wiki = await this.wikiRepo.findOne(wikiId);

    if (!wiki) {
      throw new HttpException('目标知识库不存在', HttpStatus.NOT_FOUND);
    }

    if (wiki.status !== WikiStatus.public) {
      throw new HttpException('私有文档，无法查看内容', HttpStatus.FORBIDDEN);
    }

    const createUser = await this.userService.findById(wiki.createUserId);
    return { ...wiki, createUser };
  }

  /**
   * 更新指定知识库
   * @param user
   * @param wikiId
   * @param dto
   * @returns
   */
  async updateWiki(user: OutUser, wikiId, dto: UpdateWikiDto) {
    const workspaceUser = await this.getWikiUserDetail({
      wikiId,
      userId: user.id,
    });

    if (workspaceUser.userRole !== WikiUserRole.admin) {
      throw new HttpException(
        '您没有权限更新该知识库信息',
        HttpStatus.FORBIDDEN,
      );
    }

    const oldData = await this.wikiRepo.findOne(wikiId);
    if (!oldData) {
      throw new HttpException('目标知识库不存在', HttpStatus.NOT_FOUND);
    }
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
    const wikiUser = await this.getWikiUserDetail({ wikiId, userId: user.id });
    if (wikiUser.userRole !== WikiUserRole.admin) {
      throw new HttpException('您没有权限操作该知识库', HttpStatus.FORBIDDEN);
    }
    const wiki = await this.wikiRepo.findOne(wikiId);
    if (user.id !== wiki.createUserId) {
      throw new HttpException(
        '您不是创建者，无法删除该知识库',
        HttpStatus.FORBIDDEN,
      );
    }
    await this.documentService.deleteWikiDocuments(user, wikiId);
    const users = await this.wikiUserRepo.find({ wikiId });
    await Promise.all([
      this.wikiRepo.remove(wiki),
      this.wikiUserRepo.remove(users),
    ]);
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
    const wikiUser = await this.getWikiUserDetail({ wikiId, userId: user.id });

    if (wikiUser.userRole !== WikiUserRole.admin) {
      throw new HttpException('您没有权限操作该知识库', HttpStatus.FORBIDDEN);
    }

    const wiki = await this.wikiRepo.findOne(wikiId);

    if (!wiki) {
      throw new HttpException('目标知识库不存在', HttpStatus.NOT_FOUND);
    }

    const newData = await this.wikiRepo.merge(wiki, {
      status: dto.nextStatus,
    });

    let operateDocumentError = false;
    const handleDocs = async (docIds, nextStatus) => {
      if (docIds && Array.isArray(docIds)) {
        try {
          await Promise.all(
            docIds.map((docId) =>
              this.documentService.shareDocument(
                user,
                docId,
                { sharePassword: '' },
                nextStatus,
              ),
            ),
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
      documentOperateMessage: operateDocumentError
        ? '知识库操作成功，部分文档可能无编辑权限，未能修改成功'
        : null,
    };
  }

  /**
   * 获取知识库目录
   * @param user
   * @param wikiId
   * @returns
   */
  async getWikiTocs(user: OutUser, wikiId) {
    return await this.documentService.getWikiTocs(user, wikiId);
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
    return await this.documentService.orderWikiTocs(user, wikiId, relations);
  }

  /**
   * 获取知识库目录
   * @param user
   * @param wikiId
   * @returns
   */
  async getWikiDocs(user: OutUser, wikiId) {
    return await this.documentService.getWikiDocs(user, wikiId);
  }

  /**
   * 获取公开知识库目录
   * @param wikiId
   * @returns
   */
  async getPublicWikiTocs(wikiId) {
    return await this.documentService.getPublicWikiTocs(wikiId);
  }
}
