import { SystemController } from '@controllers/system.controller';
import { SystemEntity } from '@entities/system.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemService } from '@services/system.service';

@Module({
  imports: [TypeOrmModule.forFeature([SystemEntity])],
  providers: [SystemService],
  exports: [SystemService],
  controllers: [SystemController],
})
export class SystemModule {}
