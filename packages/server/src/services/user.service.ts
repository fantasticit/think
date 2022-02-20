import {
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { CollectType, UserRole, UserStatus } from '@think/share';
import { MessageService } from '@services/message.service';
import { CollectorService } from '@services/collector.service';
import { WikiService } from '@services/wiki.service';
import { UserEntity } from '@entities/user.entity';
import { CreateUserDto } from '@dtos/create-user.dto';
import { LoginUserDto } from '@dtos/login-user.dto';
import { UpdateUserDto } from '@dtos/update-user.dto';

export type OutUser = Omit<
  UserEntity,
  'comparePassword' | 'encryptPassword' | 'encrypt' | 'password'
>;

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
    @Inject(forwardRef(() => CollectorService))
    private readonly collectorService: CollectorService,
    @Inject(forwardRef(() => WikiService))
    private readonly wikiService: WikiService,
  ) {
    this.createSuperAdmin();
  }

  private async createSuperAdmin() {
    const superadmin = this.confifgService.get('superadmin');
    if (!superadmin) return;
    if (!(await this.userRepo.findOne({ name: superadmin.name }))) {
      const res = await this.userRepo.create({
        ...superadmin,
        confirmPassword: superadmin.password,
        role: UserRole.superadmin,
      });
      await this.userRepo.save(res);
    }
    console.info('已注册超管用户，请及时修改默认密码');
  }

  /**
   * 根据 id 查询用户
   * @param id
   * @returns
   */
  async findById(id): Promise<OutUser> {
    const user = await this.userRepo.findOne(id);
    return instanceToPlain(user) as OutUser;
  }

  /**
   * 根据指定条件查找用户
   * @param opts
   * @returns
   */
  async findOne(opts: Partial<OutUser>): Promise<UserEntity> {
    const user = await this.userRepo.findOne(opts);
    return user;
  }

  /**
   * 根据 ids 查询一组用户
   * @param id
   * @returns
   */
  async findByIds(ids): Promise<OutUser[]> {
    const users = await this.userRepo.findByIds(ids);
    return users.map((user) => instanceToPlain(user)) as OutUser[];
  }

  /**
   * 创建用户
   * @param user CreateUserDto
   * @returns
   */
  async createUser(user: CreateUserDto): Promise<OutUser> {
    if (await this.userRepo.findOne({ name: user.name })) {
      throw new HttpException('该账户已被注册', HttpStatus.BAD_REQUEST);
    }

    if (user.password !== user.confirmPassword) {
      throw new HttpException('两次密码不一致，请重试', HttpStatus.BAD_REQUEST);
    }

    if (await this.userRepo.findOne({ name: user.name })) {
      throw new HttpException('该账户已被注册', HttpStatus.BAD_REQUEST);
    }

    if (user.email && (await this.userRepo.findOne({ email: user.email }))) {
      throw new HttpException('该邮箱已被注册', HttpStatus.BAD_REQUEST);
    }

    const res = await this.userRepo.create(user);
    const createdUser = await this.userRepo.save(res);
    const wiki = await this.wikiService.createWiki(createdUser, {
      name: createdUser.name,
      description: `${createdUser.name}的个人空间`,
    });
    await this.collectorService.toggleStar(createdUser, {
      targetId: wiki.id,
      type: CollectType.wiki,
    });
    await this.messageService.notify(createdUser, {
      title: `欢迎「${createdUser.name}」`,
      message: `系统已自动为您创建知识库，快去看看吧！`,
      url: `/wiki/${wiki.id}`,
    });
    return instanceToPlain(createdUser) as OutUser;
  }

  /**
   * 用户登录
   * @param user
   * @returns
   */
  async login(user: LoginUserDto): Promise<OutUser & { token: string }> {
    const { name, password } = user;
    const existUser = await this.userRepo.findOne({ where: { name } });

    if (
      !existUser ||
      !(await UserEntity.comparePassword(password, existUser.password))
    ) {
      throw new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST);
    }

    if (existUser.status === UserStatus.locked) {
      throw new HttpException('用户已锁定，无法登录', HttpStatus.BAD_REQUEST);
    }

    const res = instanceToPlain(existUser) as OutUser;
    const token = this.jwtService.sign(res);
    return Object.assign(res, { token });
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
  async updateUser(user: UserEntity, dto: UpdateUserDto): Promise<OutUser> {
    const oldData = await this.userRepo.findOne(user.id);
    const res = await this.userRepo.merge(oldData, dto);
    const ret = await this.userRepo.save(res);
    return instanceToPlain(ret) as OutUser;
  }

  async decodeToken(token) {
    const user = this.jwtService.decode(token) as UserEntity;
    return user;
  }
}
