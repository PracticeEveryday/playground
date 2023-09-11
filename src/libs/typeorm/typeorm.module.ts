import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MysqlConfigProvider } from '@libs/typeorm/mysqlConfig';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: MysqlConfigProvider,
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmDatabaseModule {}
