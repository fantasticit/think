import { HttpResponseExceptionFilter } from '@exceptions/http-response.exception';
import { IS_PRODUCTION } from '@helpers/env.helper';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@pipes/validation.pipe';
import { HttpResponseTransformInterceptor } from '@transforms/http-response.transform';
import * as compression from 'compression';
import * as express from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AppClusterService } from './app-cluster.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });
  const config = app.get(ConfigService);
  const port = config.get('server.port') || 5002;

  app.enableCors();
  app.use(compression());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.useGlobalFilters(new HttpResponseExceptionFilter());
  app.useGlobalInterceptors(new HttpResponseTransformInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(config.get('server.prefix') || '/');

  await app.listen(port);
  console.log(`[think] 主服务启动成功，端口：${port}`);
}

IS_PRODUCTION ? AppClusterService.clusterize(bootstrap) : bootstrap();
