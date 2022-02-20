import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WikiUserRole, WikiUserStatus } from '@think/share';

@Entity('wiki_user')
export class WikiUserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', comment: '知识库 Id' })
  public wikiId: string;

  @Column({ type: 'varchar', comment: '知识库创建用户 Id' })
  public createUserId: string;

  @Column({ type: 'varchar', comment: '知识库成员 Id' })
  public userId: string;

  @Column({
    type: 'enum',
    enum: WikiUserStatus,
    default: WikiUserStatus.normal,
    comment: '知识库成员状态',
  })
  public userStatus: WikiUserStatus;

  @Column({
    type: 'enum',
    enum: WikiUserRole,
    default: WikiUserRole.normal,
    comment: '知识库成员角色',
  })
  public userRole: WikiUserRole;

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
