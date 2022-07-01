import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', comment: '父级评论 Id', default: null })
  parentCommentId: string; // 父级评论 id

  @Column({ type: 'varchar', comment: '文档 Id' })
  documentId: string;

  @Column({ type: 'varchar', comment: '用户 Id' })
  createUserId: string;

  @Column({ type: 'varchar', comment: '回复用户 Id', default: null })
  replyUserId: string;

  @Column({ type: 'mediumtext', default: null, charset: 'utf8mb4' }) // 评论内容
  html: string;

  @Column({ type: 'boolean', default: true })
  pass: boolean; // 是否审核通过

  @Column({ type: 'mediumtext', default: null, charset: 'utf8mb4' })
  userAgent: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'createdAt',
    comment: '创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updatedAt',
    comment: '更新时间',
  })
  updatedAt: Date;
}
