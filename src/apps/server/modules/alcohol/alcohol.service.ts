import { Inject, Injectable } from '@nestjs/common';

import { CreateAlcoholDto } from '@apps/server/modules/alcohol/dto/createAlcohol.dto';
import { UpdateAlcoholDto } from '@apps/server/modules/alcohol/dto/updateAlcohol.dto';
import { AlcoholRepositoryInterface } from '@apps/server/modules/alcohol/interface/alcohol.interface';
import { InjectionToken } from '@libs/mysql/repository/injectionToken';

@Injectable()
export class AlcoholService {
  constructor(@Inject(InjectionToken.ALCOHOL_REPOSITORY) private readonly alcoholRepository: AlcoholRepositoryInterface) {}

  public async create(createAlcoholDto: CreateAlcoholDto) {
    const result = await this.alcoholRepository.create(createAlcoholDto);

    return result;
  }

  findAll() {
    return `This action returns all alcohol`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alcohol`;
  }

  update(id: number, _updateAlcoholDto: UpdateAlcoholDto) {
    return `This action updates a #${id} alcohol`;
  }

  remove(id: number) {
    return `This action removes a #${id} alcohol`;
  }
}
