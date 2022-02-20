import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@modules/user.module';
import { WikiModule } from '@modules/wiki.module';
import { DocumentModule } from '@modules/document.module';
import { MessageModule } from '@modules/message.module';
import { CommentEntity } from '@entities/comment.entity';
import { CommentService } from '@services/comment.service';
import { CommentController } from '@controllers/comment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => WikiModule),
    forwardRef(() => DocumentModule),
    forwardRef(() => MessageModule),
  ],
  providers: [CommentService],
  exports: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
