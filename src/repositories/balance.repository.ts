import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {BalanceDataSource} from '../datasources';
import {Balance, BalanceRelations} from '../models';

export class BalanceRepository extends DefaultCrudRepository<
  Balance,
  typeof Balance.prototype.user_id,
  BalanceRelations
> {
  constructor(
    @inject('datasources.balance') dataSource: BalanceDataSource,
  ) {
    super(Balance, dataSource);
  }
}
