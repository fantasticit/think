import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CollectType } from '@think/share';

@Entity('collector')
export class CollectorEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', comment: '用户 Id' })
  public userId: string;

  @Column({ type: 'varchar', comment: '收藏目标 Id' })
  public targetId: string;

  @Column({
    type: 'enum',
    enum: CollectType,
    default: CollectType.document,
    comment: '收藏目标类型',
  })
  public type: CollectType;

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
