import { OrganizationController } from '@controllers/organization.controller';
import { OrganizationEntity } from '@entities/organization.entity';
import { AuthModule } from '@modules/auth.module';
import { MessageModule } from '@modules/message.module';
import { UserModule } from '@modules/user.module';
import { WikiModule } from '@modules/wiki.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationService } from '@services/organization.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => MessageModule),
    forwardRef(() => AuthModule),
    forwardRef(() => WikiModule),
  ],
  providers: [OrganizationService],
  exports: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
