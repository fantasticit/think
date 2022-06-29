import { DocumentController } from '@controllers/document.controller';
import { DocumentEntity } from '@entities/document.entity';
import { AuthModule } from '@modules/auth.module';
import { MessageModule } from '@modules/message.module';
import { StarModule } from '@modules/star.module';
import { TemplateModule } from '@modules/template.module';
import { UserModule } from '@modules/user.module';
import { ViewModule } from '@modules/view.module';
import { WikiModule } from '@modules/wiki.module';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentService } from '@services/document.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => ConfigModule),
    forwardRef(() => UserModule),
    forwardRef(() => WikiModule),
    forwardRef(() => MessageModule),
    forwardRef(() => TemplateModule),
    forwardRef(() => StarModule),
    forwardRef(() => ViewModule),
  ],
  providers: [DocumentService],
  exports: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
