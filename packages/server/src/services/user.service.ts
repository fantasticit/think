import { CreateUserDto } from '@dtos/create-user.dto';
import { LoginUserDto } from '@dtos/login-user.dto';
import { UpdateUserDto } from '@dtos/update-user.dto';
import { UserEntity } from '@entities/user.entity';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageService } from '@services/message.service';
import { StarService } from '@services/star.service';
import { WikiService } from '@services/wiki.service';
import { UserStatus } from '@think/domains';
import { instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';

export type OutUser = Omit<UserEntity, 'comparePassword' | 'encryptPassword' | 'encrypt' | 'password'>;

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

    @Inject(forwardRef(() => WikiService))
    private readonly wikiService: WikiService
  ) {}

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
    await this.starService.toggleStar(createdUser, {
      wikiId: wiki.id,
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
  async login(user: LoginUserDto): Promise<{ user: OutUser; token: string; domain: string; expiresIn: number }> {
    const { name, password } = user;
    const existUser = await this.userRepo.findOne({ where: { name } });

    if (!existUser || !(await UserEntity.comparePassword(password, existUser.password))) {
      throw new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST);
    }

    if (existUser.status === UserStatus.locked) {
      throw new HttpException('用户已锁定，无法登录', HttpStatus.BAD_REQUEST);
    }

    const res = instanceToPlain(existUser) as OutUser;
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
}
