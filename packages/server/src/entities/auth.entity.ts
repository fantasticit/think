import { AuthEnum } from '@think/domains';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('auth')
export class AuthEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  /**
   * 关联用户 Id
   */
  @Column({ type: 'varchar', comment: '关联用户 Id' })
  public userId: string;

  /**
   * 权限类型
   */
  @Column({
    type: 'enum',
    enum: AuthEnum,
    default: AuthEnum.noAccess,
    comment: '权限类型',
  })
  public auth: AuthEnum;

  /**
   * 所属组织 Id
   */
  @Column({ type: 'varchar', comment: '所属组织 Id' })
  public organizationId: string;

  /**
   * 所属知识库 Id
   */
  @Column({ type: 'varchar', default: null, comment: '所属知识库 Id' })
  public wikiId: string;

  /**
   * 所属文档 Id
   */
  @Column({ type: 'varchar', default: null, comment: '所属文档 Id' })
  public documentId: string;

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
