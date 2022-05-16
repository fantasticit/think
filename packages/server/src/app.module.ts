import { CollectorEntity } from '@entities/collector.entity';
import { CommentEntity } from '@entities/comment.entity';
import { DocumentEntity } from '@entities/document.entity';
import { DocumentAuthorityEntity } from '@entities/document-authority.entity';
import { MessageEntity } from '@entities/message.entity';
import { TemplateEntity } from '@entities/template.entity';
import { UserEntity } from '@entities/user.entity';
import { ViewEntity } from '@entities/view.entity';
import { WikiEntity } from '@entities/wiki.entity';
import { WikiUserEntity } from '@entities/wiki-user.entity';
import { CollectorModule } from '@modules/collector.module';
import { CommentModule } from '@modules/comment.module';
import { DocumentModule } from '@modules/document.module';
import { FileModule } from '@modules/file.module';
import { MessageModule } from '@modules/message.module';
import { TemplateModule } from '@modules/template.module';
import { UserModule } from '@modules/user.module';
import { ViewModule } from '@modules/view.module';
import { WikiModule } from '@modules/wiki.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getConfig } from '@think/config';

const ENTITIES = [
  UserEntity,
  WikiEntity,
  WikiUserEntity,
  DocumentAuthorityEntity,
  DocumentEntity,
  CollectorEntity,
  CommentEntity,
  MessageEntity,
  TemplateEntity,
  ViewEntity,
];

const MODULES = [
  UserModule,
  WikiModule,
  DocumentModule,
  CollectorModule,
  FileModule,
  CommentModule,
  MessageModule,
  TemplateModule,
  ViewModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [getConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          entities: ENTITIES,
          keepConnectionAlive: true,
          ...config.get('db.mysql'),
        } as TypeOrmModuleOptions;
      },
    }),
    ...MODULES,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
