import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {BalanceDataSource} from '../datasources';
import {BalanceReserve, BalanceReserveRelations} from '../models';

export class BalanceReserveRepository extends DefaultCrudRepository<
  BalanceReserve,
  typeof BalanceReserve.prototype.order_id,
  BalanceReserveRelations
> {
  constructor(
    @inject('datasources.balance') dataSource: BalanceDataSource,
  ) {
    super(BalanceReserve, dataSource);
  }
}
