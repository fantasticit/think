import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('document_authority')
export class DocumentAuthorityEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', comment: '文档所属知识库 Id' })
  public wikiId: string;

  @Column({ type: 'varchar', comment: '文档 Id' })
  public documentId: string;

  @Column({ type: 'varchar', comment: '文档创建用户 Id' })
  public createUserId: string;

  @Column({ type: 'varchar', comment: '用户 Id' })
  public userId: string;

  @Column({ type: 'bool', default: false })
  public readable: boolean;

  @Column({ type: 'bool', default: false })
  public editable: boolean;

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
