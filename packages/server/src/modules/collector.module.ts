import { CollectorController } from '@controllers/collector.controller';
import { CollectorEntity } from '@entities/collector.entity';
import { DocumentModule } from '@modules/document.module';
import { UserModule } from '@modules/user.module';
import { WikiModule } from '@modules/wiki.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectorService } from '@services/collector.service';

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
