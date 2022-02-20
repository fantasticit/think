import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@modules/user.module';
import { WikiModule } from '@modules/wiki.module';
import { DocumentModule } from '@modules/document.module';
import { MessageModule } from '@modules/message.module';
import { TemplateEntity } from '@entities/template.entity';
import { TemplateService } from '@services/template.service';
import { TemplateController } from '@controllers/template.controller';

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
