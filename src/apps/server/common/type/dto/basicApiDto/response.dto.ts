import { Exclude, Expose } from 'class-transformer';
import { validate } from 'class-validator';

import ErrorResponse from '@commons/exception/errorResponse';
import { BadRequestException } from '@commons/exception/exception/badRequest.exception';
import { ValidationException } from '@commons/exception/exception/validation.exception';

export class ResponseDto<T> {
  @Exclude() private readonly _data: T;
  @Exclude() private readonly _message?: string;

  constructor(data: T, message?: string) {
    this._data = data;
    this._message = message;
  }

  static async OK_DATA_WITH_OPTIONAL_MESSAGE<T>(data: T, message?: string): Promise<ResponseDto<T>> {
    if (typeof data !== 'object') {
      throw new BadRequestException(ErrorResponse.TYPE.TYPE_ERROR_MUST_BE_OBJECT<T>(data));
    }

    const errors = await validate(data);
    if (errors.length > 0) throw new ValidationException(errors);

    return new ResponseDto<T>(data, message);
  }

  @Expose()
  get message(): string | undefined {
    return this._message;
  }

  @Expose()
  get data(): T {
    return this._data;
  }
}
