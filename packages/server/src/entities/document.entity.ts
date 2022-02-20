import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { DocumentStatus } from '@think/share';

@Entity('document')
export class DocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', comment: '文档所属知识库 Id' })
  public wikiId: string;

  @Column({ type: 'boolean', default: false, comment: '知识库首页文档' })
  public isWikiHome: boolean;

  @Column({ type: 'varchar', comment: '创建用户 Id' })
  public createUserId: string;

  @Column({ type: 'varchar', comment: '父文档 Id', default: null })
  public parentDocumentId: string;

  @Column({ type: 'varchar', length: 50, comment: '文档标题', default: '' })
  public title: string;

  @Column({ type: 'text', comment: '文档内容' })
  public content: string;

  @Column({ type: 'blob', comment: '文档内容' })
  public state: Uint8Array;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.private,
    comment: '文档状态',
  })
  public status: DocumentStatus;

  @Exclude()
  @Column({ type: 'varchar', comment: '文档分享密码', default: '' })
  public sharePassword: string;

  @Column({ type: 'bigint', default: 0, comment: '文档访问量' })
  public views: number;

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
