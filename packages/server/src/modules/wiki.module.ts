import { WikiController } from '@controllers/wiki.controller';
import { WikiEntity } from '@entities/wiki.entity';
import { WikiUserEntity } from '@entities/wiki-user.entity';
import { CollectorModule } from '@modules/collector.module';
import { DocumentModule } from '@modules/document.module';
import { MessageModule } from '@modules/message.module';
import { UserModule } from '@modules/user.module';
import { ViewModule } from '@modules/view.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WikiService } from '@services/wiki.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WikiEntity, WikiUserEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => DocumentModule),
    forwardRef(() => MessageModule),
    forwardRef(() => ViewModule),
    forwardRef(() => CollectorModule),
  ],
  providers: [WikiService],
  exports: [WikiService],
  controllers: [WikiController],
})
export class WikiModule {}
