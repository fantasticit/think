import { TemplateController } from '@controllers/template.controller';
import { TemplateEntity } from '@entities/template.entity';
import { DocumentModule } from '@modules/document.module';
import { MessageModule } from '@modules/message.module';
import { UserModule } from '@modules/user.module';
import { WikiModule } from '@modules/wiki.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateService } from '@services/template.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TemplateEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => WikiModule),
    forwardRef(() => DocumentModule),
    forwardRef(() => MessageModule),
  ],
  providers: [TemplateService],
  exports: [TemplateService],
  controllers: [TemplateController],
})
export class TemplateModule {}
