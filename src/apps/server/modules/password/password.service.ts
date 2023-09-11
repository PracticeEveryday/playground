import { Inject, Injectable } from '@nestjs/common';

import ErrorResponse from '@apps/server/common/customExceptions/errorResponse';
import { toPagination } from '@apps/server/common/helper/pagination.helper';
import { GetDomainResDto } from '@apps/server/modules/password/dto/api-dto/getDomain.res.dto';
import { PasswordServiceHelper } from '@apps/server/modules/password/helper/passwordService.helper';
import { PasswordRepositoryInterface } from '@apps/server/modules/password/interface/PasswordRepository.interface';
import { BadRequestException, ConflictException, NotFoundException } from '@commons/customExceptions/exception';
import { UpdatedResDto, DeletedResDto } from '@commons/dto/basicApiDto';
import { CreateResDto } from '@commons/dto/basicApiDto/createResult.res.dto';
import { EnvService } from '@libs/env/env.service';
import { EnvEnum } from '@libs/env/envEnum';
import { LogService } from '@libs/log/log.service';
import { InjectionToken } from '@libs/mysql/repository/injectionToken';
import { PasswordUtil } from '@libs/util/password.util';

import * as Dtos from './dto';

@Injectable()
export class PasswordService {
  private readonly PASSWORD_KEY: string;

  constructor(
    private readonly logService: LogService,
    private readonly envService: EnvService,
    private readonly passwordServiceHelper: PasswordServiceHelper,

    @Inject(InjectionToken.PASSWORD_REPOSITORY) private readonly passwordRepository: PasswordRepositoryInterface,
  ) {
    this.PASSWORD_KEY = envService.get(EnvEnum.PASSWORD_KEY);
  }

  /**
   * 비밀번호 조회 By 도메인
   *
   * @param param GetDomainReqDto
   */
  public async findOneByDomain(param: Dtos.GetDomainParamReqDto): Promise<GetDomainResDto> {
    const password = await this.passwordServiceHelper.getPasswordByDomain(param);

    return new GetDomainResDto(PasswordUtil.decodedPassword(password.password, this.PASSWORD_KEY));
  }

  /**
   * 비밀번호 조회 By 페이지네이션
   *
   * @param getPasswordsReqDto pagination을 상속 받은 dto
   */
  public async findManyWithPagination(getPasswordsReqDto: Dtos.GetPasswordsQueryReqDto): Promise<Dtos.GetPasswordsResDto> {
    const passwordArr = await this.passwordRepository.findManyWithPagination(getPasswordsReqDto);
    const passwordResDtoArr = passwordArr.map((password) => new Dtos.PasswordResDto(password));

    const { totalCount } = await this.passwordRepository.count();

    const pagination = toPagination(totalCount, getPasswordsReqDto.pageNo, getPasswordsReqDto.pageSize);
    return new Dtos.GetPasswordsResDto(passwordResDtoArr, pagination);
  }

  /**
   * 비밀번호 생성
   *
   * @param body CreatePasswordReqDto
   */
  public async createOne(body: Dtos.CreatePasswordReqDto) {
    const getDomainParamReqDto = Dtos.GetDomainParamReqDto.toDTO(body.domain);
    const password = await this.passwordRepository.findOneByDomain(getDomainParamReqDto);

    if (password) {
      throw new ConflictException({ errorResponse: ErrorResponse.AUTH.ALREADY_EXIST_USER });
    }

    body.password = PasswordUtil.hashPassword(body.password, this.PASSWORD_KEY);
    const createResult = await this.passwordRepository.createOne(body);

    if (createResult.affectedRows !== 1) {
      throw new BadRequestException({ errorResponse: ErrorResponse.AUTH.ALREADY_EXIST_USER });
    }

    return new CreateResDto(true);
  }

  /**
   * 비밀번호 수정
   *
   * @param body UpdatePasswordReqDto
   */
  public async updateOne(body: Dtos.UpdatePasswordReqDto): Promise<UpdatedResDto> {
    const getDomainParamReqDto = Dtos.GetDomainParamReqDto.toDTO(body.domain);
    const password = await this.passwordServiceHelper.getPasswordByDomain(getDomainParamReqDto);

    const updatedInfo = body.compareValue(password);
    updatedInfo.password = PasswordUtil.hashPassword(updatedInfo.password, this.PASSWORD_KEY);

    const updatedResult = await this.passwordRepository.updateOne(updatedInfo);

    if (updatedResult.affectedRows !== 1) {
      throw new NotFoundException({ errorResponse: ErrorResponse.AUTH.NOT_FOUND_USER });
    }

    return new UpdatedResDto(true);
  }

  /**
   * 비밀번호 삭제 By id
   *
   * @param param GetDomainParamReqDto
   */
  public async removeOneByDomain(param: Dtos.GetDomainParamReqDto): Promise<DeletedResDto> {
    await this.passwordServiceHelper.validateByDomain(param);

    const deleteResult = await this.passwordRepository.removeOneByDomain(param);

    if (deleteResult.affectedRows !== 1) {
      throw new NotFoundException({ errorResponse: ErrorResponse.AUTH.NOT_FOUND_USER });
    }
    return new DeletedResDto(true);
  }
}
