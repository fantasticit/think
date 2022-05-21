import { DocumentController } from '@controllers/document.controller';
import { DocumentEntity } from '@entities/document.entity';
import { DocumentAuthorityEntity } from '@entities/document-authority.entity';
import { CollectorModule } from '@modules/collector.module';
import { MessageModule } from '@modules/message.module';
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
    TypeOrmModule.forFeature([DocumentAuthorityEntity, DocumentEntity]),
    forwardRef(() => ConfigModule),
    forwardRef(() => UserModule),
    forwardRef(() => WikiModule),
    forwardRef(() => MessageModule),
    forwardRef(() => TemplateModule),
    forwardRef(() => CollectorModule),
    forwardRef(() => ViewModule),
  ],
  providers: [DocumentService],
  exports: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
