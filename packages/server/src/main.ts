import { HttpResponseExceptionFilter } from '@exceptions/http-response.exception';
import { IS_PRODUCTION } from '@helpers/env.helper';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@pipes/validation.pipe';
import { HttpResponseTransformInterceptor } from '@transforms/http-response.transform';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AppClusterService } from './app-cluster.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get('server.port') || 5002;

  app.enableCors({
    origin: config.get('client.siteUrl'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  config.get('server.enableRateLimit') &&
    app.use(
      rateLimit({
        windowMs: config.get('server.rateLimitWindowMs'),
        max: config.get('server.rateLimitMax'),
      })
    );
  app.use(cookieParser());
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
