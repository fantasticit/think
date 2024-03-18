import { Module } from '@nestjs/common';

import { ViewController } from '@controllers/view.controller';
import { ViewService } from '@services/view.service';

@Module({
  providers: [ViewService],
  exports: [ViewService],
  controllers: [ViewController],
})
export class ViewModule {}
