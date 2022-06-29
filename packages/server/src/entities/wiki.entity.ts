import { getShortId } from '@helpers/shortid.herlper';
import { DEFAULT_WIKI_AVATAR } from '@think/constants';
import { WikiStatus } from '@think/domains';
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('wiki')
export class WikiEntity {
  @BeforeInsert()
  getShortId() {
    this.id = getShortId();
  }

  @PrimaryColumn()
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

  @Column({ type: 'varchar', comment: '所属组织 Id' })
  public organizationId: string;

  @Column({ type: 'varchar', comment: '知识库首页文档Id', default: '' })
  public homeDocumentId: string;

  @Column({
    type: 'enum',
    enum: WikiStatus,
    default: WikiStatus.private,
    comment: '知识库状态',
  })
  public status: WikiStatus;

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
