import { OperateUserAuthDto } from '@dtos/auth.dto';
import { CreateOrganizationDto } from '@dtos/organization.dto';
import { OrganizationEntity } from '@entities/organization.entity';
import { UserEntity } from '@entities/user.entity';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '@services/auth.service';
import { MessageService } from '@services/message.service';
import { UserService } from '@services/user.service';
import { WikiService } from '@services/wiki.service';
import { AuthEnum, buildMessageURL, IOrganization, IUser } from '@think/domains';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly organizationRepo: Repository<OrganizationEntity>,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,

    @Inject(forwardRef(() => WikiService))
    private readonly wikiService: WikiService
  ) {}

  public async findById(id: string) {
    return await this.organizationRepo.findOne(id);
  }

  public async findByIds(ids) {
    return await this.organizationRepo.findByIds(ids);
  }

  /**
   * 创建组织
   * @param user
   * @param dto
   * @returns
   */
  public async createOrganization(user: IUser, dto: CreateOrganizationDto) {
    const [, count] = await this.organizationRepo.findAndCount({ createUserId: user.id });

    if (count >= 5) {
      throw new HttpException('个人可创建组织上限为 5 个', HttpStatus.FORBIDDEN);
    }

    const data = {
      ...dto,
      createUserId: user.id,
    };

    if (await this.organizationRepo.findOne({ name: data.name })) {
      throw new HttpException('该组织已存在', HttpStatus.BAD_REQUEST);
    }

    const organization = await this.organizationRepo.save(await this.organizationRepo.create(data));

    await this.authService.createOrUpdateAuth(user.id, {
      auth: AuthEnum.creator,
      organizationId: organization.id,
      wikiId: null,
      documentId: null,
    });

    return organization;
  }

  /**
   * 更新组织信息
   * @param user
   * @param dto
   */
  public async updateOrganization(user: IUser, organizationId: IOrganization['id'], dto: CreateOrganizationDto) {
    await this.authService.canEdit(user.id, {
      organizationId,
      wikiId: null,
      documentId: null,
    });

    const oldData = await this.organizationRepo.findOne(organizationId);

    if (!oldData) {
      throw new HttpException('目标组织不存在', HttpStatus.NOT_FOUND);
    }

    return await this.organizationRepo.save(await this.organizationRepo.merge(oldData, dto));
  }

  /**
   * 删除组织
   * @param user
   * @param organizationId
   * @returns
   */
  async deleteOrganization(user: IUser, organizationId) {
    const organization = await this.organizationRepo.findOne(organizationId);
    await this.authService.canDelete(user.id, {
      organizationId: organization.id,
      wikiId: null,
      documentId: null,
    });
    await this.wikiService.deleteOrganizationWiki(user, organizationId);
    await this.organizationRepo.remove(organization);
    await this.authService.deleteOrganization(organization.id);
    return organization;
  }

  /**
   * 获取用户个人组织
   * @param user
   * @returns
   */
  public async getPersonalOrganization(user: IUser) {
    const organization = await this.organizationRepo.findOne({ createUserId: user.id, isPersonal: true });
    return organization;
  }

  /**
   * 获取用户可访问的组织
   * @param user
   */
  public async getUserOrganizations(user: IUser) {
    const ids = await this.authService.getUserCanViewOrganizationIds(user.id);
    return await this.organizationRepo.findByIds(ids);
  }

  /**
   * 获取组织详情
   * @param user
   * @returns
   */
  public async getOrganizationDetail(user: IUser, id: IOrganization['id']) {
    const organization = await this.organizationRepo.findOne({ id });
    if (!organization) {
      throw new HttpException('组织不存在', HttpStatus.NOT_FOUND);
    }
    await this.authService.canView(user.id, {
      organizationId: id,
      wikiId: null,
      documentId: null,
    });
    return organization;
  }

  /**
   * 获取组织成员
   * @param user
   * @param shortId
   * @returns
   */
  public async getMembers(user: IUser, id: IOrganization['id'], pagination) {
    const organization = await this.organizationRepo.findOne({ id });

    if (!organization) {
      throw new HttpException('组织不存在', HttpStatus.NOT_FOUND);
    }

    await this.authService.canView(user.id, {
      organizationId: id,
      wikiId: null,
      documentId: null,
    });

    const { data: usersAuth, total } = await this.authService.getUsersAuthInOrganization(organization.id, pagination);

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
   * 添加组织成员
   * @param user
   * @param wikiId
   * @param dto
   * @returns
   */
  async addMember(user: UserEntity, organizationId, dto: OperateUserAuthDto) {
    const organization = await this.organizationRepo.findOne(organizationId);

    if (!organization) {
      throw new HttpException('组织不存在', HttpStatus.NOT_FOUND);
    }

    const targetUser = await this.userService.findOne({ name: dto.userName });

    if (!targetUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    const ret = await this.authService.createOrUpdateOtherUserAuth(user.id, targetUser.id, {
      auth: dto.userAuth,
      organizationId: organization.id,
      wikiId: null,
      documentId: null,
    });

    await this.messageService.notify(targetUser.id, {
      title: `您被添加到组织「${organization.name}」`,
      message: `您被添加到知识库「${organization.name}」，快去看看吧！`,
      url: buildMessageURL('toOrganization')({
        organizationId: organization.id,
      }),
      uniqueId: organization.id,
    });

    return ret;
  }

  /**
   * 修改组织成员
   * @param user
   * @param wikiId
   * @param dto
   * @returns
   */
  async updateMember(user: UserEntity, organizationId, dto: OperateUserAuthDto) {
    const organization = await this.organizationRepo.findOne(organizationId);

    if (!organization) {
      throw new HttpException('组织不存在', HttpStatus.NOT_FOUND);
    }

    const targetUser = await this.userService.findOne({ name: dto.userName });

    if (!targetUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    const ret = await this.authService.createOrUpdateOtherUserAuth(user.id, targetUser.id, {
      auth: dto.userAuth,
      organizationId: organization.id,
      wikiId: null,
      documentId: null,
    });

    await this.messageService.notify(targetUser.id, {
      title: `组织「${organization.name}」权限变更`,
      message: `您在组织「${organization.name}」权限已变更，快去看看吧！`,
      url: buildMessageURL('toOrganization')({
        organizationId: organization.id,
      }),
      uniqueId: organization.id,
    });

    return ret;
  }

  /**
   * 删除组织成员
   * @param user
   * @param wikiId
   * @param dto
   * @returns
   */
  async deleteMember(user: UserEntity, organizationId, dto: OperateUserAuthDto) {
    const organization = await this.organizationRepo.findOne(organizationId);

    if (!organization) {
      throw new HttpException('组织不存在', HttpStatus.NOT_FOUND);
    }

    const targetUser = await this.userService.findOne({ name: dto.userName });

    if (!targetUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    const ret = await this.authService.deleteOtherUserAuth(user.id, targetUser.id, {
      auth: dto.userAuth,
      organizationId: organization.id,
      wikiId: null,
      documentId: null,
    });

    await this.messageService.notify(targetUser.id, {
      title: `组织「${organization.name}」权限收回`,
      message: `您在组织「${organization.name}」权限已收回！`,
      url: buildMessageURL('toOrganization')({
        organizationId: organization.id,
      }),
      uniqueId: organization.id,
    });

    return ret;
  }
}
