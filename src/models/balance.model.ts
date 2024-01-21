import {Entity, model, property} from '@loopback/repository';

/**
 * The model class is generated from OpenAPI schema - Balance
 * Balance
 */
@model({name: 'Balance'})
export class Balance extends Entity {
  constructor(data?: Partial<Balance>) {
    super(data);
    if (data != null && typeof data === 'object') {
      Object.assign(this, data);
    }
  }

  /**
   *
   */
  @property({
    type: 'number',
    format: 'int32',
    minimum: 0,
    maximum: 2147483647,
    id: true,
    generated: false,
  })
  user_id: number;

  /**
   *
   */
  @property({
    type: 'string',
  })
  account?: string;

  /**
   *
   */
  @property({
    type: 'number',
    format: 'float',
    minimum: 0,
    maximum: 3.402823669209385e+38,
  })
  balance: number;

}

export interface BalanceRelations {
  // describe navigational properties here
}

export type BalanceWithRelations = Balance & BalanceRelations;


