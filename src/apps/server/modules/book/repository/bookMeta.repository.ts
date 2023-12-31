import { Inject } from '@nestjs/common';
import { ResultSetHeader } from 'mysql2';

import { CreateBookReqDto } from '@apps/server/modules/book/dto/api-dto/createBook.req.dto';
import { DeleteBookReqDto } from '@apps/server/modules/book/dto/api-dto/deleteBook.req.dto';
import { UpdateBookReqDto } from '@apps/server/modules/book/dto/api-dto/updateBook.req.dto';
import { BookMetaRepositoryInterface } from '@apps/server/modules/book/interface/bookMetaRepository';
import { FindOneByIdReqDto } from '@commons/type/dto/basicApiDto/findOneById.req.dto';
import { MysqlService } from '@libs/adapter/db/mysql/mysql.service';

export class BookMetaRepository implements BookMetaRepositoryInterface {
  private ROW_IDX = 0 as const;

  private FILED_IDX = 1 as const;

  constructor(@Inject(MysqlService) private readonly mysqlService: MysqlService) {}

  public async createOne(createBookReqDto: CreateBookReqDto): Promise<ResultSetHeader> {
    const query = `INSERT INTO password.book_meta (book_id, author, publisher, page_count, created_at, updated_at, deleted_at)
                     VALUES (${createBookReqDto.bookId}, '${createBookReqDto.author}', '${createBookReqDto.publisher}',
                             ${createBookReqDto.pageCount}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null)`;
    const createQueryResult = await createBookReqDto.connectionPool.execute<ResultSetHeader>(query);

    return createQueryResult[this.ROW_IDX];
  }

  public async updateOne(updateBookReqDto: UpdateBookReqDto, param: FindOneByIdReqDto): Promise<ResultSetHeader> {
    const query = `
      UPDATE password.book_meta
      SET author='${updateBookReqDto.author}',
          publisher='${updateBookReqDto.publisher}',
          page_count='${updateBookReqDto.pageCount}'
      WHERE book_id=${param.id}`;

    const updateQueryResult = await updateBookReqDto.connectionPool.execute<ResultSetHeader>(query);
    return updateQueryResult[this.ROW_IDX];
  }

  public async removeOne(deleteBookReqDto: DeleteBookReqDto): Promise<ResultSetHeader> {
    const query = `DELETE FROM password.book_meta WHERE book_id=${deleteBookReqDto.id}`;

    const deleteQueryResult = await deleteBookReqDto.connectionPool.execute<ResultSetHeader>(query);

    return deleteQueryResult[this.ROW_IDX];
  }
}
