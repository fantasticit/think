import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@modules/user.module';
import { WikiModule } from '@modules/wiki.module';
import { MessageModule } from '@modules/message.module';
import { CollectorModule } from '@modules/collector.module';
import { TemplateModule } from '@modules/template.module';
import { ViewModule } from '@modules/view.module';
import { DocumentAuthorityEntity } from '@entities/document-authority.entity';
import { DocumentEntity } from '@entities/document.entity';
import { DocumentController } from '@controllers/document.controller';
import { DocumentService } from '@services/document.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentAuthorityEntity, DocumentEntity]),
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
