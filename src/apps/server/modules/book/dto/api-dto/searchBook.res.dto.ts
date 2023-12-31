import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { FindOneByIdResDto } from '@apps/server/modules/book/dto/api-dto/findOneById.res.dto';
import { PaginationResDto } from '@commons/type/dto/piginationDto/pagination.res.dto';

export class SearchBookPaginationDto extends PaginationResDto {
  @Exclude() _bookArr: FindOneByIdResDto[];

  constructor(bookArr: FindOneByIdResDto[], paginationInfo: PaginationResDto) {
    super(paginationInfo);
    this._bookArr = bookArr;
  }

  @Expose()
  @ApiProperty({ type: FindOneByIdResDto, isArray: true, description: '검색한 책의 배열입니다.' })
  get bookArr(): FindOneByIdResDto[] {
    return this._bookArr;
  }
}
