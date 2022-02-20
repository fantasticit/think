import * as express from 'express';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { HttpResponseExceptionFilter } from '@exceptions/http-response.exception';
import { HttpResponseTransformInterceptor } from '@transforms/http-response.transform';
import { ValidationPipe } from '@pipes/validation.pipe';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors();
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.useGlobalFilters(new HttpResponseExceptionFilter());
  app.useGlobalInterceptors(new HttpResponseTransformInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(config.get('server.prefix') || '/');
  await app.listen(config.get('server.port') || 4000);
  const url = await app.getUrl();
  console.log('服务启动成功：', url);
}

bootstrap();
