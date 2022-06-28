import { VerifyEntity } from '@entities/verify.entity';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemService } from '@services/system.service';
import { randomInt } from 'node:crypto';
import { Repository } from 'typeorm';
import { isEmail } from 'validator';

@Injectable()
export class VerifyService {
  constructor(
    @InjectRepository(VerifyEntity)
    private readonly verifyRepo: Repository<VerifyEntity>,

    @Inject(forwardRef(() => SystemService))
    private readonly systemService: SystemService
  ) {}

  /**
   * 删除验证记录
   * @param record
   */
  private async deleteVerifyCode(id) {
    await this.verifyRepo.remove(await this.verifyRepo.find(id));
  }

  /**
   * 向指定邮箱发送验证码
   * @param email
   */
  public async sendVerifyCode(email: string) {
    if (!email || !isEmail(email)) {
      throw new HttpException('请检查邮箱地址', HttpStatus.BAD_REQUEST);
    }

    const verifyCode = randomInt(1000000).toString().padStart(6, '0');
    const record = await this.verifyRepo.save(await this.verifyRepo.create({ email, verifyCode }));
    await this.systemService.sendEmail({
      to: email,
      subject: '验证码',
      html: `<p>您的验证码为 ${verifyCode}</p>`,
    });

    const timer = setTimeout(() => {
      this.deleteVerifyCode(record.id);
      clearTimeout(timer);
    }, 5 * 60 * 1000);
  }

  /**
   * 检验验证码
   * @param email
   * @param verifyCode
   * @returns
   */
  public async checkVerifyCode(email: string, verifyCode: string) {
    if (!email || !isEmail(email)) {
      throw new HttpException('请检查邮箱地址', HttpStatus.BAD_REQUEST);
    }

    const ret = await this.verifyRepo.findOne({ email, verifyCode });

    if (!ret) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    return Boolean(ret);
  }
}
