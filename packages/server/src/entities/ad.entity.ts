import { AdType } from '@think/domains';

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('ad')
export class AdEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AdType,
    default: AdType.shareDocAside,
    comment: '权限类型',
  })
  public type: AdType;

  @Column({ type: 'mediumtext', comment: '广告封面图' })
  cover: string;

  @Column({ type: 'mediumtext', comment: '跳转链接', default: null, charset: 'utf8mb4' })
  url: string;

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
