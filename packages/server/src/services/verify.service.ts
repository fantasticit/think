import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { RedisDBEnum } from '@constants/*';
import { buildRedis } from '@helpers/redis.helper';
import { SystemService } from '@services/system.service';
import Redis from 'ioredis';
import { randomInt } from 'node:crypto';
import { isEmail } from 'validator';

@Injectable()
export class VerifyService {
  private redis: Redis;

  constructor(
    @Inject(forwardRef(() => SystemService))
    private readonly systemService: SystemService
  ) {
    this.buildRedis();
  }

  private async buildRedis() {
    try {
      this.redis = await buildRedis(RedisDBEnum.verify);
      console.log('[think] 验证码服务启动成功');
    } catch (e) {
      console.error(`[think] 验证码服务启动错误: "${e.message}"`);
    }
  }

  /**
   * 向指定邮箱发送验证码
   * @param email
   */
  public sendVerifyCode = async (email: string) => {
    if (!email || !isEmail(email)) {
      throw new HttpException('请检查邮箱地址', HttpStatus.BAD_REQUEST);
    }

    const verifyCode = randomInt(1000000).toString().padStart(6, '0');

    await this.redis.set(`verify-${email}`, verifyCode, 'EX', 5 * 60);
    await this.systemService.sendEmail({
      to: email,
      subject: '云策文档-验证码',
      html: `<p>您的验证码为 ${verifyCode}</p>`,
    });
  };

  /**
   * 检验验证码
   * @param email
   * @param verifyCode
   * @returns
   */
  public checkVerifyCode = async (email: string, verifyCode: string) => {
    if (!email || !isEmail(email)) {
      throw new HttpException('请检查邮箱地址', HttpStatus.BAD_REQUEST);
    }

    const ret = await this.redis.get(`verify-${email}`);

    if (!ret) {
      throw new HttpException('验证码已过期，请重新获取', HttpStatus.BAD_REQUEST);
    }

    if (ret !== verifyCode) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    return Boolean(ret);
  };
}
