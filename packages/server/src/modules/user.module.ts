import {
  Module,
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getConfig } from '@think/config';
import { MessageModule } from '@modules/message.module';
import { CollectorModule } from '@modules/collector.module';
import { WikiModule } from '@modules/wiki.module';
import { UserEntity } from '@entities/user.entity';
import { UserService } from '@services/user.service';
import { UserController } from '@controllers/user.controller';

const config = getConfig();
const jwtConfig = config.jwt as {
  secretkey: string;
  expiresIn: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secretkey,
    });
  }

  async validate(user) {
    const ret = await this.userService.validateUser(user);

    if (!ret) {
      throw new UnauthorizedException('身份验证失败');
    }

    return user;
  }
}

const passModule = PassportModule.register({ defaultStrategy: 'jwt' });
const jwtModule = JwtModule.register({
  secret: jwtConfig.secretkey,
  signOptions: { expiresIn: jwtConfig.expiresIn },
});

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule,
    forwardRef(() => WikiModule),
    forwardRef(() => MessageModule),
    forwardRef(() => CollectorModule),
    passModule,
    jwtModule,
  ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
  exports: [UserService, passModule, jwtModule],
})
export class UserModule {}
