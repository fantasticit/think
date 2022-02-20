import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('template')
export class TemplateEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'boolean', default: false, comment: '是否公开' })
  public isPublic: boolean;

  @Column({ type: 'varchar', comment: '创建用户 Id' })
  public createUserId: string;

  @Column({ type: 'varchar', length: 200, comment: '标题' })
  public title: string;

  @Column({ type: 'text', comment: '内容' })
  public content: string;

  @Column({
    type: 'blob',
    comment: '内容',
  })
  public state: Uint8Array;

  @Column({ type: 'int', default: 0, comment: '使用量' })
  public usageAmount: number;

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
