import { AuthController } from '@controllers/auth.controller';
import { AuthEntity } from '@entities/auth.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '@services/auth.service';

import { UserModule } from './user.module';

@Module({
  imports: [TypeOrmModule.forFeature([AuthEntity]), forwardRef(() => UserModule)],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
