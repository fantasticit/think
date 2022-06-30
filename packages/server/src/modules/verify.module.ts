import { VerifyController } from '@controllers/verify.controller';
import { VerifyEntity } from '@entities/verify.entity';
import { SystemModule } from '@modules/system.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyService } from '@services/verify.service';

@Module({
  imports: [TypeOrmModule.forFeature([VerifyEntity]), forwardRef(() => SystemModule)],
  providers: [VerifyService],
  exports: [VerifyService],
  controllers: [VerifyController],
})
export class VerifyModule {}
