import { MessageController } from '@controllers/message.controller';
import { MessageEntity } from '@entities/message.entity';
import { UserModule } from '@modules/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from '@services/message.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity]), forwardRef(() => UserModule)],
  providers: [MessageService],
  exports: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
