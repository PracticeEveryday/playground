import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmptyDate, IsOptionalDate } from '@commons/framework/decorator/validation/isCustomDate.decorator';
import { IsNotEmptyNumber } from '@commons/framework/decorator/validation/isCustomNumber.decorator';
import { IsNotEmptyString } from '@commons/framework/decorator/validation/isCustomString.decorator';

export class PasswordDto {
  @IsNotEmptyNumber('id', 0)
  @ApiProperty({ example: 1, description: 'password Id입니다.' })
  id: number;

  @IsNotEmptyString('domain', 0, 100)
  @ApiProperty({ example: 'naver', description: '비밀번호 도메인 정보입니다.' })
  domain: string;

  @IsNotEmptyString('password', 0, 150)
  @ApiProperty({ example: '123456789a', description: '비밀번호 도메인 정보입니다.' })
  password: string;

  @IsNotEmptyDate()
  @ApiProperty({ example: '2023-07-05 09:12:05:000Z', description: 'password 생성 날짜입니다.' })
  createdAt: Date;

  @IsNotEmptyDate()
  @ApiProperty({ example: '2023-07-05 09:12:05:000Z', description: 'password 수정 날짜입니다.' })
  updatedAt: Date;

  @IsOptionalDate()
  @ApiPropertyOptional({ example: '2023-07-05 09:12:05:000Z', description: 'password 삭제 날짜입니다.' })
  deletedAt: Date | null;
}
