import { HttpResponseExceptionFilter } from '@exceptions/http-response.exception';
import { FILE_DEST, FILE_ROOT_PATH } from '@helpers/file.helper/local.client';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@pipes/validation.pipe';
import { HttpResponseTransformInterceptor } from '@transforms/http-response.transform';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['warn', 'error'],
  });
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

  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

  app.use(cookieParser());
  app.use(compression());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.useGlobalFilters(new HttpResponseExceptionFilter());
  app.useGlobalInterceptors(new HttpResponseTransformInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(config.get('server.prefix') || '/');

  if (config.get('oss.local.enable')) {
    const serverStatic = express.static(FILE_ROOT_PATH);
    app.use(FILE_DEST, (req, res, next) => {
      res.header('Cross-Origin-Resource-Policy', 'cross-origin');
      return serverStatic(req, res, next);
    });
  }

  await app.listen(port);

  console.log(`[think] 主服务启动成功，端口：${port}`);
}

bootstrap();
