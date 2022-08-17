import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('system')
export class SystemEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  /**
   * 是否锁定系统，锁定后除系统管理员外均不可登录，同时禁止注册
   */
  @Column({ type: 'boolean', default: false, comment: '是否锁定系统' })
  isSystemLocked: boolean;

  /**
   * 启用邮箱校验后，注册、重置密码等操作必须经过邮箱验证
   */
  @Column({ type: 'boolean', default: false, comment: '是否启用邮箱校验' })
  enableEmailVerify: boolean;

  /**
   * 邮箱服务地址
   */

  @Column({ type: 'text', default: null })
  emailServiceHost: string;

  /**
   * 邮箱服务端口
   */

  @Column({ type: 'text', default: null })
  emailServicePort: string;

  /**
   * 邮箱服务用户名
   */

  @Column({ type: 'text', default: null })
  emailServiceUser: string;

  /**
   * 邮箱服务授权码
   */

  @Column({ type: 'text', default: null })
  emailServicePassword: string;

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
