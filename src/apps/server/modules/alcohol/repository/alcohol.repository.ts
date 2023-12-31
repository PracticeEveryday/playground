import { Inject, Injectable } from '@nestjs/common';
import { ResultSetHeader } from 'mysql2';

import { AlcoholRepositoryInterface } from '@apps/server/modules/alcohol/interface/alcoholRepository.interface';
import { AlcoholDto } from '@commons/type/dto/moduleDto/alcohol.dto';
import { MysqlService } from '@libs/adapter/db/mysql/mysql.service';

@Injectable()
export class AlcoholRepository implements AlcoholRepositoryInterface {
  private ROW_IDX = 0 as const;

  private FILED_IDX = 1 as const;

  constructor(@Inject(MysqlService) private readonly mysqlService: MysqlService) {}

  public create = async (creatInfo: Partial<AlcoholDto>): Promise<ResultSetHeader> => {
    const query = `
      INSERT INTO password.alcohol (drinking_date, relationship, mood, created_at, updated_at, deleted_at)
      VALUES ('${creatInfo.drinkingDate.toISOString().slice(0, 19)}', '${creatInfo.relationship}', '${
      creatInfo.mood
    }', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null)
    `;
    const createdQueryResult = await this.mysqlService.executeSingleQuery<ResultSetHeader>(query);

    return createdQueryResult[this.ROW_IDX];
  };
}
