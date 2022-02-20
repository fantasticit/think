import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WikiStatus, DEFAULT_WIKI_AVATAR } from '@think/share';

@Entity('wiki')
export class WikiEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 200, comment: '知识库名称' })
  public name: string;

  @Column({
    type: 'varchar',
    comment: '知识库头像',
    default: DEFAULT_WIKI_AVATAR,
  })
  public avatar: string;

  @Column({ type: 'varchar', comment: '描述信息', default: '' })
  public description: string;

  @Column({ type: 'varchar', comment: '创建用户 Id' })
  public createUserId: string;

  @Column({
    type: 'enum',
    enum: WikiStatus,
    default: WikiStatus.private,
    comment: '知识库状态',
  })
  public status: WikiStatus;

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
