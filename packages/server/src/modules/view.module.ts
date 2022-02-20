import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewEntity } from '@entities/view.entity';
import { ViewController } from '@controllers/view.controller';
import { ViewService } from '@services/view.service';

@Module({
  imports: [TypeOrmModule.forFeature([ViewEntity])],
  providers: [ViewService],
  exports: [ViewService],
  controllers: [ViewController],
})
export class ViewModule {}
