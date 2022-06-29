import { getShortId } from '@helpers/shortid.herlper';
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('organization')
export class OrganizationEntity {
  @BeforeInsert()
  getShortId() {
    this.id = getShortId();
  }

  @PrimaryColumn()
  public id: string;

  /**
   * 组织名称
   */
  @Column({ type: 'varchar', length: 50, comment: '组织名称' })
  public name: string;

  /**
   * 组织描述信息
   */
  @Column({ type: 'varchar', default: '', comment: '描述信息' })
  public description: string;

  /**
   * 组织Logo
   */
  @Column({ type: 'varchar', default: '', comment: '组织Logo' })
  public logo: string;

  /**
   * 创建用户 Id
   */
  @Column({ type: 'varchar', comment: '创建用户 Id' })
  public createUserId: string;

  /**
   * 是否为个人组织
   */
  @Column({ type: 'boolean', default: false, comment: '是否为个人组织' })
  isPersonal: boolean;

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
