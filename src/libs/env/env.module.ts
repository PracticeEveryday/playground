import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NodeEnvEnum } from './nodeEnv.enum';
import { EnvService } from './env.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: (() => {
        const envFiles: string[] = [];
        switch (process.env.NODE_ENV) {
          case NodeEnvEnum.Main:
            envFiles.unshift(`.env.${NodeEnvEnum.Main}`);
          case NodeEnvEnum.Test:
            envFiles.unshift(`.env.${NodeEnvEnum.Test}`);
          case NodeEnvEnum.Dev:
            envFiles.unshift(`.env.${NodeEnvEnum.Dev}`);
          default:
            envFiles.unshift(`.env`);
        }
        return envFiles;
      })(),
      isGlobal: true,
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: EnvModule,
    };
  }
}
