import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@modules/user.module';
import { WikiModule } from '@modules/wiki.module';
import { DocumentModule } from '@modules/document.module';
import { CollectorEntity } from '@entities/collector.entity';
import { CollectorService } from '@services/collector.service';
import { CollectorController } from '@controllers/collector.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CollectorEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => WikiModule),
    forwardRef(() => DocumentModule),
  ],
  providers: [CollectorService],
  exports: [CollectorService],
  controllers: [CollectorController],
})
export class CollectorModule {}
