import { CommentController } from '@controllers/comment.controller';
import { CommentEntity } from '@entities/comment.entity';
import { AuthModule } from '@modules/auth.module';
import { DocumentModule } from '@modules/document.module';
import { MessageModule } from '@modules/message.module';
import { UserModule } from '@modules/user.module';
import { WikiModule } from '@modules/wiki.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from '@services/comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    forwardRef(() => AuthModule),
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
