import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';

import ErrorResponse from '@commons/exception/errorResponse';
import { BaseException } from '@commons/exception/exception/base.exception';
import { UnknownException } from '@commons/exception/exception/unknown.exception';
import { MysqlService } from '@libs/adapter/db/mysql/mysql.service';

/**
 * 트랜젝션을 위한 인터셉터입니다.
 * 기본적으로 성공 실패시 중복되는 코드를 해당 인터셉터를 재사용함으로서 해결합니다.
 */
@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly mysqlService: MysqlService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const req = context.switchToHttp().getRequest();
    const connectionPool = await this.dbInit();

    req.connectionPool = connectionPool;

    return next.handle().pipe(
      catchError(async (error) => {
        await connectionPool.rollback();
        await connectionPool.release();

        if (error instanceof BaseException) {
          throw error;
        } else {
          throw new UnknownException(ErrorResponse.COMMON.INTERNAL_SERVER_ERROR, error.stack, error.message);
        }
      }),
      tap(async () => {
        await connectionPool.commit();
        await connectionPool.release();
      }),
    );
  }

  private async dbInit() {
    const cunnectionPool = await this.mysqlService.getConnectionPool();
    await cunnectionPool.connect();
    await cunnectionPool.beginTransaction();

    return cunnectionPool;
  }
}
