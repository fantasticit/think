import { VerifyController } from '@controllers/verify.controller';
import { SystemModule } from '@modules/system.module';
import { forwardRef, Module } from '@nestjs/common';
import { VerifyService } from '@services/verify.service';

@Module({
  imports: [forwardRef(() => SystemModule)],
  providers: [VerifyService],
  exports: [VerifyService],
  controllers: [VerifyController],
})
export class VerifyModule {}
