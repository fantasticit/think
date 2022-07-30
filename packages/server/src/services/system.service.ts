import { SystemEntity } from '@entities/system.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { Repository } from 'typeorm';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(SystemEntity)
    private readonly systemRepo: Repository<SystemEntity>,

    private readonly confifgService: ConfigService
  ) {
    this.loadFromConfigFile();
  }

  /**
   * 从数据库获取配置
   * @returns
   */
  public async getConfigFromDatabase() {
    const data = await this.systemRepo.find();
    return (data && data[0]) || null;
  }

  /**
   * 更新系统配置
   * @param patch
   * @returns
   */
  public async updateConfigInDatabase(patch: Partial<SystemEntity>) {
    const current = await this.getConfigFromDatabase();
    return await this.systemRepo.save(await this.systemRepo.merge(current, patch));
  }

  /**
   * 从配置文件载入配置
   */
  private async loadFromConfigFile() {
    const currentConfig = await this.getConfigFromDatabase();

    // 同步邮件服务配置
    const emailConfigFromConfigFile = await this.confifgService.get('server.email');

    let emailConfig = {};

    if (emailConfigFromConfigFile && typeof emailConfigFromConfigFile === 'object') {
      emailConfig = {
        emailServiceHost: currentConfig ? currentConfig.emailServiceHost : emailConfigFromConfigFile.host,
        emailServicePort: currentConfig ? currentConfig.emailServicePort : emailConfigFromConfigFile.port,
        emailServiceUser: currentConfig ? currentConfig.emailServiceUser : emailConfigFromConfigFile.user,
        emailServicePassword: currentConfig ? currentConfig.emailServicePassword : emailConfigFromConfigFile.password,
      };
    }

    const newConfig = currentConfig
      ? await this.systemRepo.merge(currentConfig, emailConfig)
      : await this.systemRepo.create(emailConfig);
    await this.systemRepo.save(newConfig);

    console.log('[think] 已载入文件配置', JSON.stringify(newConfig, null, 2));
  }

  /**
   * 发送邮件
   * @param content
   */
  public async sendEmail(mail: { to: string; subject: string; text?: string; html?: string }) {
    const config = await this.getConfigFromDatabase();

    if (!config) {
      throw new HttpException('系统未配置邮箱服务，请联系系统管理员', HttpStatus.SERVICE_UNAVAILABLE);
    }

    const emailConfig = {
      host: config.emailServiceHost,
      port: +config.emailServicePort,
      user: config.emailServiceUser,
      pass: config.emailServicePassword,
    };

    if (Object.keys(emailConfig).some((key) => !emailConfig[key])) {
      throw new HttpException('系统邮箱服务配置不完善，请联系系统管理员', HttpStatus.SERVICE_UNAVAILABLE);
    }

    const transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.port === 465,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`发送邮件失败`));
      }, 10 * 1000);

      transporter.sendMail(
        {
          from: emailConfig.user,
          ...mail,
        },
        (err, info) => {
          if (err) {
            reject(err);
          } else {
            resolve(info);
          }
        }
      );
    });
  }

  async getPublicConfig() {
    const config = await this.getConfigFromDatabase();
    return { isSystemLocked: config.isSystemLocked, enableEmailVerify: config.enableEmailVerify };
  }
}
