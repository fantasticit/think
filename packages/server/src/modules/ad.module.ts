import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdController } from '@controllers/ad.controller';
import { AdEntity } from '@entities/ad.entity';
import { AdService } from '@services/ad.service';

import { UserModule } from './user.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdEntity]), forwardRef(() => UserModule)],
  providers: [AdService],
  exports: [AdService],
  controllers: [AdController],
})
export class AdModule {}
