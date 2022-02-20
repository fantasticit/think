import { IsNotEmpty, IsOptional } from 'class-validator';

export class CommentDto {
  @IsOptional()
  parentCommentId: string;

  @IsNotEmpty({ message: '文档 Id 不能为空' })
  documentId: string;

  @IsNotEmpty({ message: '内容不能为空' })
  html: string;

  @IsOptional()
  replyUserId?: string;
}

export class UpdateCommentDto {
  @IsNotEmpty({ message: '评论 Id 不能为空' })
  id: string;

  @IsNotEmpty({ message: '内容不能为空' })
  html: string;
}
