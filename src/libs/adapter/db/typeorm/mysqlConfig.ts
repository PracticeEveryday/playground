import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { PasswordEntity } from '@libs/adapter/db/typeorm/entity/password.entity';
import { EnvService } from '@libs/env/env.service';
import { EnvEnum } from '@libs/env/envEnum';

@Injectable()
export class MysqlConfigProvider implements TypeOrmOptionsFactory {
  private readonly host: string;
  private readonly port: number;
  private readonly username: string;
  private readonly password: string;
  private readonly database: string;

  constructor(private envService: EnvService) {
    this.port = envService.get(EnvEnum.DATABASE_PORT);
    this.host = envService.get(EnvEnum.DATABASE_HOST);
    this.username = envService.get(EnvEnum.DATABASE_USER);
    this.password = envService.get(EnvEnum.DATABASE_PASSWORD);
    this.database = envService.get(EnvEnum.DATABASE_DB);
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.host,
      port: this.port,
      username: this.username,
      password: this.password,
      database: this.database,
      entities: [PasswordEntity],
      synchronize: true,
      logging: false, //['error', 'query'],
      extra: {
        charset: 'utf8mb4_unicode_ci',
      },
      migrations: [`${__dirname}/migrations/*.{js,ts}`],
      migrationsTableName: 'migrations',
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
