import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('verify')
export class VerifyEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', comment: '邮箱地址' })
  public email: string;

  @Column({ type: 'varchar', comment: '验证码' })
  public verifyCode: string;

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
