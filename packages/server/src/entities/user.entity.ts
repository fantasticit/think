import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { UserRole, UserStatus } from '@think/share';

@Entity('user')
export class UserEntity {
  static comparePassword(password0, password1) {
    return bcrypt.compareSync(password0, password1);
  }

  static encryptPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  @BeforeInsert()
  encrypt() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 200, comment: '用户名称' })
  public name: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', length: 200, comment: '用户加密密码' })
  public password: string;

  @Column({ type: 'varchar', comment: '头像地址', default: '' })
  public avatar: string;

  @Column({ type: 'varchar', comment: '邮箱地址', default: '' })
  public email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.normal,
    comment: '用户角色',
  })
  public role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.normal,
    comment: '用户状态',
  })
  public status: UserStatus;

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
