import { RegisterUserDto, ResetPasswordDto } from '@dtos/create-user.dto';
import { LoginUserDto } from '@dtos/login-user.dto';
import { UpdateUserDto } from '@dtos/update-user.dto';
import { SystemEntity } from '@entities/system.entity';
import { UserEntity } from '@entities/user.entity';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageService } from '@services/message.service';
import { OrganizationService } from '@services/organization.service';
import { StarService } from '@services/star.service';
import { SystemService } from '@services/system.service';
import { VerifyService } from '@services/verify.service';
import { WikiService } from '@services/wiki.service';
import { ORGANIZATION_LOGOS } from '@think/constants';
import { IUser, UserStatus } from '@think/domains';
import { instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    private readonly confifgService: ConfigService,

    @Inject(forwardRef(() => JwtService))
    private readonly jwtService: JwtService,

    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,

    @Inject(forwardRef(() => StarService))
    private readonly starService: StarService,

    @Inject(forwardRef(() => OrganizationService))
    private readonly organizationService: OrganizationService,

    @Inject(forwardRef(() => WikiService))
    private readonly wikiService: WikiService,

    @Inject(forwardRef(() => VerifyService))
    private readonly verifyService: VerifyService,

    @Inject(forwardRef(() => SystemService))
    private readonly systemService: SystemService
  ) {
    this.createDefaultSystemAdminFromConfigFile();
  }

  /**
   * 从配置文件创建默认系统管理员
   */
  private async createDefaultSystemAdminFromConfigFile() {
    if (await this.userRepo.findOne({ isSystemAdmin: true })) {
      return;
    }

    const config = await this.confifgService.get('server.admin');

    if (!config.name || !config.password || !config.email) {
      throw new Error(`请指定名称、密码和邮箱`);
    }

    if (await this.userRepo.findOne({ email: config.email })) {
      return;
    }

    try {
      const res = await this.userRepo.create({
        ...config,
        isSystemAdmin: true,
      });
      const createdUser = (await this.userRepo.save(res)) as unknown as IUser;

      await this.organizationService.createOrganization(createdUser, {
        name: createdUser.name,
        description: `${createdUser.name}的个人组织`,
        logo: ORGANIZATION_LOGOS[0],
        isPersonal: true,
      });

      console.log('[think] 已创建默认系统管理员，请尽快登录系统修改密码');
    } catch (e) {
      console.error(`[think] 创建默认系统管理员失败：`, e.message);
    }
  }

  /**
   * 根据 id 查询用户
   * @param id
   * @returns
   */
  async findById(id): Promise<IUser> {
    const user = await this.userRepo.findOne(id);
    return instanceToPlain(user) as IUser;
  }

  /**
   * 根据指定条件查找用户
   * @param opts
   * @returns
   */
  async findOne(opts: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.userRepo.findOne(opts);
    return user;
  }

  /**
   * 根据 ids 查询一组用户
   * @param id
   * @returns
   */
  async findByIds(ids): Promise<IUser[]> {
    const users = await this.userRepo.findByIds(ids);
    return users.map((user) => instanceToPlain(user)) as IUser[];
  }

  /**
   * 创建用户
   * @param user CreateUserDto
   * @returns
   */
  async createUser(user: RegisterUserDto): Promise<IUser> {
    const currentSystemConfig = await this.systemService.getConfigFromDatabase();

    if (currentSystemConfig.isSystemLocked) {
      throw new HttpException('系统维护中，暂不可注册', HttpStatus.FORBIDDEN);
    }

    if (await this.userRepo.findOne({ name: user.name })) {
      throw new HttpException('该账户已被注册', HttpStatus.BAD_REQUEST);
    }

    if (await this.userRepo.findOne({ name: user.name })) {
      throw new HttpException('该账户已被注册', HttpStatus.BAD_REQUEST);
    }

    if (user.email && (await this.userRepo.findOne({ email: user.email }))) {
      throw new HttpException('该邮箱已被注册', HttpStatus.BAD_REQUEST);
    }

    if (
      currentSystemConfig.enableEmailVerify &&
      !(await this.verifyService.checkVerifyCode(user.email, user.verifyCode))
    ) {
      throw new HttpException('验证码不正确，请检查', HttpStatus.BAD_REQUEST);
    }

    const res = await this.userRepo.create(user);
    const createdUser = await this.userRepo.save(res);

    await this.organizationService.createOrganization(createdUser, {
      name: createdUser.name,
      description: `${createdUser.name}的个人组织`,
      logo: ORGANIZATION_LOGOS[0],
      isPersonal: true,
    });

    return instanceToPlain(createdUser) as IUser;
  }

  /**
   * 重置密码
   * @param registerUser
   */
  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const currentSystemConfig = await this.systemService.getConfigFromDatabase();

    if (currentSystemConfig.isSystemLocked) {
      throw new HttpException('系统维护中，暂不可使用', HttpStatus.FORBIDDEN);
    }

    const { email, password, confirmPassword, verifyCode } = resetPasswordDto;

    const inDatabaseUser = await this.userRepo.findOne({ email });

    if (!inDatabaseUser) {
      throw new HttpException('该邮箱尚未注册', HttpStatus.BAD_REQUEST);
    }

    if (password !== confirmPassword) {
      throw new HttpException('两次密码不一致，请重试', HttpStatus.BAD_REQUEST);
    }

    if (currentSystemConfig.enableEmailVerify && !(await this.verifyService.checkVerifyCode(email, verifyCode))) {
      throw new HttpException('验证码不正确，请检查', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepo.save(
      await this.userRepo.merge(inDatabaseUser, { password: UserEntity.encryptPassword(password) })
    );

    return instanceToPlain(user);
  }

  /**
   * 用户登录
   * @param user
   * @returns
   */
  async login(user: LoginUserDto): Promise<{ user: IUser; token: string; domain: string; expiresIn: number }> {
    const currentSystemConfig = await this.systemService.getConfigFromDatabase();

    const { name, password } = user;
    let existUser = await this.userRepo.findOne({ where: { name } });

    if (!existUser) {
      existUser = await this.userRepo.findOne({ where: { email: name } });
    }

    const isExistUserSystemAdmin = existUser ? existUser.isSystemAdmin : false;

    if (currentSystemConfig.isSystemLocked && !isExistUserSystemAdmin) {
      throw new HttpException('系统维护中，暂不可登录', HttpStatus.FORBIDDEN);
    }

    if (!existUser || !(await UserEntity.comparePassword(password, existUser.password))) {
      throw new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST);
    }

    if (existUser.status === UserStatus.locked) {
      throw new HttpException('用户已锁定，无法登录', HttpStatus.BAD_REQUEST);
    }

    const res = instanceToPlain(existUser) as IUser;
    const token = this.jwtService.sign(res);
    const domain = this.confifgService.get('client.siteDomain');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const expiresIn = this.jwtService.decode(token, { complete: true }).payload.exp;
    return { user: res, token, domain, expiresIn };
  }

  async logout() {
    const domain = this.confifgService.get('client.siteDomain');
    return { token: '', domain };
  }

  async validateUser(user: UserEntity) {
    return await this.findById(user.id);
  }

  /**
   * 更新用户信息
   * @param user
   * @param dto
   * @returns
   */
  async updateUser(user: UserEntity, dto: UpdateUserDto): Promise<IUser> {
    const currentSystemConfig = await this.systemService.getConfigFromDatabase();
    const oldData = await this.userRepo.findOne(user.id);

    if (oldData && dto && oldData.email !== dto.email) {
      if (await this.userRepo.findOne({ where: { email: dto.email } })) {
        throw new HttpException('该邮箱已被注册', HttpStatus.BAD_REQUEST);
      }

      if (
        currentSystemConfig.enableEmailVerify &&
        !(await this.verifyService.checkVerifyCode(dto.email, dto.verifyCode))
      ) {
        throw new HttpException('验证码不正确，请检查', HttpStatus.BAD_REQUEST);
      }
    }

    const res = await this.userRepo.merge(oldData, dto);
    const ret = await this.userRepo.save(res);
    return instanceToPlain(ret) as IUser;
  }

  async decodeToken(token) {
    const user = this.jwtService.decode(token) as UserEntity;
    return user;
  }

  /**
   * 获取用户列表
   * @param pagination
   * @returns
   */
  async getUsers() {
    const query = this.userRepo.createQueryBuilder('user');
    const [data] = await query.getManyAndCount();
    return data;
  }

  /**
   * 锁定或解锁用户
   * @param user
   * @param targetUserId
   */
  async toggleLockUser(user: UserEntity, targetUserId) {
    const currentUser = await this.userRepo.findOne(user.id);

    if (!currentUser.isSystemAdmin) {
      throw new HttpException('您无权操作', HttpStatus.FORBIDDEN);
    }

    const targetUser = await this.userRepo.findOne(targetUserId);

    if (!targetUser) {
      throw new HttpException('目标用户不存在', HttpStatus.NOT_FOUND);
    }

    const nextStatus = targetUser.status === UserStatus.normal ? UserStatus.locked : UserStatus.normal;
    return await this.userRepo.save(await this.userRepo.merge(targetUser, { status: nextStatus }));
  }

  /**
   * 获取系统配置
   * @param user
   * @returns
   */
  async getSystemConfig(user: UserEntity) {
    const currentUser = await this.userRepo.findOne(user.id);

    if (!currentUser.isSystemAdmin) {
      throw new HttpException('您无权操作', HttpStatus.FORBIDDEN);
    }

    return await this.systemService.getConfigFromDatabase();
  }

  /**
   * 发送测试邮件
   * @param user
   */
  async sendTestEmail(user: UserEntity) {
    const currentUser = await this.userRepo.findOne(user.id);

    if (!currentUser.isSystemAdmin) {
      throw new HttpException('您无权操作', HttpStatus.FORBIDDEN);
    }

    const currentConfig = await this.systemService.getConfigFromDatabase();
    try {
      await this.systemService.sendEmail({
        to: currentConfig.emailServiceUser,
        subject: '测试邮件',
        html: `<p>测试邮件</p>`,
      });
      return '测试邮件发送成功';
    } catch (err) {
      throw new HttpException(err.message || err, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 更新系统配置
   * @param user
   * @param targetUserId
   */
  async updateSystemConfig(user: UserEntity, systemConfig: Partial<SystemEntity>) {
    const currentUser = await this.userRepo.findOne(user.id);

    if (!currentUser.isSystemAdmin) {
      throw new HttpException('您无权操作', HttpStatus.FORBIDDEN);
    }

    return await this.systemService.updateConfigInDatabase(systemConfig);
  }
}
