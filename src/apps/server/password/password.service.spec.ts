import { Test, TestingModule } from '@nestjs/testing';

import { CreatePasswordReqDto } from './dto/api-dto/create-password.req.dto';
import { CreatePasswordResDto } from './dto/api-dto/create-password.res.dto';
import { GetDomainParamReqDto } from './dto/api-dto/getDomain.req.dto';
import { GetDomainResDto } from './dto/api-dto/getDomain.res.dto';
import { UpdatePasswordReqDto } from './dto/api-dto/updatePassword.req.dto';
import { PasswordService } from './password.service';
import { passwordProviders } from './providers/password.provider';
import { EnvModule } from '../../../libs/env/env.module';
import { LogModule } from '../../../libs/log/log.module';
import { MysqlModule } from '../../../libs/mysql/mysql.module';
import { PasswordUtilModule } from '../../../libs/utils/password-util/password-util.module';
import { ValidateUtilModule } from '../../../libs/utils/validate-util/validate-util.module';
import { DeletedResDto } from '../common/dto/deleteResult.res.dto';
import { UpdatedResDto } from '../common/dto/updateResult.res.dto';

const getDomainResDto = new GetDomainResDto('test1');

describe('PasswordService Test', () => {
  let passwordService: PasswordService;
  let mockPasswordService: Partial<PasswordService>;

  beforeEach(async () => {
    mockPasswordService = {
      findOneByDomain: jest.fn().mockReturnValue(getDomainResDto),
      create: jest.fn().mockImplementation(async (body: CreatePasswordReqDto): Promise<CreatePasswordResDto> => {
        return new CreatePasswordResDto('test');
      }),
      update: jest.fn().mockImplementation(async (body: UpdatedResDto): Promise<UpdatedResDto> => {
        return new UpdatedResDto(true);
      }),
      deleteOneByDomain: jest.fn().mockReturnValue(new DeletedResDto(true)),
    };

    const module: TestingModule = await Test.createTestingModule({
      // 의존성 주입하 Module 넣기
      imports: [PasswordUtilModule, ValidateUtilModule, LogModule, EnvModule, MysqlModule],
      // 테스트할 모듈 넣기
      providers: [PasswordService, ...passwordProviders],
    }).compile();

    passwordService = module.get<PasswordService>(PasswordService);
  });

  // service 유무 확인
  it('should be defined', () => {
    expect(passwordService).toBeDefined();
  });

  it('password 생성하기', async () => {
    const createPasswordReqDto = CreatePasswordReqDto.toDTO('test', 'test1');
    const newPassword = await passwordService.create(createPasswordReqDto);
    const createPasswordResDto = new CreatePasswordResDto('test');
    const result = await mockPasswordService.create(createPasswordReqDto);

    // 생성하는 것도 같음.
    expect(result).toStrictEqual(newPassword);
    expect(result).toStrictEqual(createPasswordResDto);
  });

  it('Domain에 따른 비밀번호 가져오기', async () => {
    const getDomainBodyReqDto = GetDomainParamReqDto.toDTO('test');
    const password = await passwordService.findOneByDomain(getDomainBodyReqDto);

    const mockResult = await mockPasswordService.findOneByDomain(getDomainBodyReqDto);
    // 있는 거는 같음.
    expect(mockResult).toStrictEqual(password);
  });

  //TODO:
  it('password update', async () => {
    const updatePasswordReqDto = new UpdatePasswordReqDto();
    updatePasswordReqDto.domain = 'test';
    updatePasswordReqDto.password = '12345678a';
    const updated = await passwordService.update(updatePasswordReqDto);

    const mockResult = await mockPasswordService.update(updatePasswordReqDto);
    // 있는 거는 같음.
    expect(mockResult).toStrictEqual(updated);
  });

  it('Domain의 비밀번호 삭제하기', async () => {
    const getDomainBodyReqDto = GetDomainParamReqDto.toDTO('test');
    const deleteResult = await passwordService.deleteOneByDomain(getDomainBodyReqDto);
    const mockResult = await mockPasswordService.deleteOneByDomain(getDomainBodyReqDto);
    // 있는 거는 같음.
    expect(mockResult).toStrictEqual(deleteResult);
  });

  describe('Domain 데이터가 없을 떄', () => {
    it('Domain의 비밀번호가 존재하지 않을 때', async () => {
      // 없으면 에러 던짐
      const notFoundDto = GetDomainParamReqDto.toDTO('없는거');
      await expect(async () => await passwordService.findOneByDomain(notFoundDto)).rejects.toThrow();
    });

    it('Domain의 비밀번호가 존재하지 않을 때', async () => {
      // 없으면 에러 던짐
      const notFoundDto = GetDomainParamReqDto.toDTO('없는거');
      await expect(async () => await passwordService.deleteOneByDomain(notFoundDto)).rejects.toThrow();
    });

    it('password update 시 도메인 정보가 없을떄', async () => {
      const updatePasswordReqDto = new UpdatePasswordReqDto();
      updatePasswordReqDto.domain = 'test1';
      updatePasswordReqDto.password = '12345678a';

      await expect(async () => await passwordService.update(updatePasswordReqDto)).rejects.toThrow();
    });
  });
});
