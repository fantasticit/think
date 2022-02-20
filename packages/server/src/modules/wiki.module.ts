import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@modules/user.module';
import { DocumentModule } from '@modules/document.module';
import { MessageModule } from '@modules/message.module';
import { CollectorModule } from '@modules/collector.module';
import { WikiEntity } from '@entities/wiki.entity';
import { WikiUserEntity } from '@entities/wiki-user.entity';
import { WikiController } from '@controllers/wiki.controller';
import { WikiService } from '@services/wiki.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WikiEntity, WikiUserEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => DocumentModule),
    forwardRef(() => MessageModule),
    forwardRef(() => CollectorModule),
  ],
  providers: [WikiService],
  exports: [WikiService],
  controllers: [WikiController],
})
export class WikiModule {}
