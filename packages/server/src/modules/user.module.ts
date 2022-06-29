import { UserController } from '@controllers/user.controller';
import { UserEntity } from '@entities/user.entity';
import { MessageModule } from '@modules/message.module';
import { OrganizationModule } from '@modules/organization.module';
import { StarModule } from '@modules/star.module';
import { SystemModule } from '@modules/system.module';
import { VerifyModule } from '@modules/verify.module';
import { WikiModule } from '@modules/wiki.module';
import { forwardRef, Inject, Injectable, Module, UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '@services/user.service';
import { getConfig } from '@think/config';
import { Request as RequestType } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

const config = getConfig();
const jwtConfig = config.jwt as {
  secretkey: string;
  expiresIn: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secretkey,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: RequestType) => {
          const token = request?.cookies?.token;
          return token;
        },
      ]),
    });
  }

  async validate(user) {
    const ret = await this.userService.validateUser(user);

    if (!ret) {
      throw new UnauthorizedException('请登录后使用');
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
    forwardRef(() => StarModule),
    forwardRef(() => VerifyModule),
    forwardRef(() => SystemModule),
    forwardRef(() => OrganizationModule),
    passModule,
    jwtModule,
  ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
  exports: [UserService, passModule, jwtModule],
})
export class UserModule {}
