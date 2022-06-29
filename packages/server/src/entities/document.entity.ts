import { getShortId } from '@helpers/shortid.herlper';
import { DocumentStatus } from '@think/domains';
import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('document')
export class DocumentEntity {
  @BeforeInsert()
  getShortId() {
    this.id = getShortId();
  }

  @PrimaryColumn()
  public id: string;

  @Column({ type: 'varchar', comment: '所属组织 Id' })
  public organizationId: string;

  @Column({ type: 'varchar', comment: '所属知识库 Id' })
  public wikiId: string;

  @Column({ type: 'boolean', default: false, comment: '是否为知识库首页文档' })
  public isWikiHome: boolean;

  @Column({ type: 'varchar', comment: '创建用户 Id' })
  public createUserId: string;

  @Column({ type: 'varchar', comment: '父文档 Id', default: null })
  public parentDocumentId: string;

  @Column({ type: 'varchar', default: '未命名文档', comment: '文档标题' })
  public title: string;

  @Column({ type: 'longtext', comment: '文档内容' })
  public content: string;

  @Column({ type: 'longblob', comment: '文档内容' })
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

  @Column({ type: 'bigint', default: 0, comment: '文档索引顺序' })
  public index: number;

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
