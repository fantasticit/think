import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('star')
export class StarEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', comment: '用户 Id' })
  public userId: string;

  @Column({ type: 'varchar', comment: '知识库 Id' })
  public wikiId: string;

  @Column({ type: 'varchar', comment: '文档 Id', default: null })
  public documentId: string;

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
