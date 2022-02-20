import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('view')
export class ViewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', comment: '文档 Id' })
  documentId: string;

  // public 表示从公开渠道访问
  @Column({ type: 'varchar', comment: '访问用户 Id', default: 'public' })
  userId: string;

  @Column({ type: 'mediumtext', default: null, charset: 'utf8mb4' })
  originUserAgent: string;

  @Column({ type: 'mediumtext', default: null, charset: 'utf8mb4' })
  parsedUserAgent: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    comment: '创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    comment: '更新时间',
  })
  updatedAt: Date;
}
