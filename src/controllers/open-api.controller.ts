import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Response, RestBindings, api, operation, requestBody} from '@loopback/rest';
import {BalanceReserve} from '../models/balance-reserve.model';
import {Balance} from '../models/balance.model';
import {BalanceRepository, BalanceReserveRepository} from '../repositories';

/**
 * The controller class is generated from OpenAPI spec with operations tagged
 * by <no-tag>.
 *
 */
@api({
  components: {
    schemas: {
      Balance: {
        type: 'object',
        properties: {
          user_id: {
            type: 'number',
            format: 'int32',
          },
          account: {
            type: 'string',
          },
          balance: {
            type: 'number',
            format: 'float',
          },
        },
      },
      BalanceReserve: {
        type: 'object',
        properties: {
          order_id: {
            type: 'string',
          },
          user_id: {
            type: 'number',
            format: 'int32',
          },
          price: {
            type: 'number',
            format: 'float',
          },
          completed: {
            type: 'boolean',
          },
        },
      },
    },
  },
  paths: {},
})
export class OpenApiController {
  constructor(
    @repository(BalanceRepository) private balanceRepo: BalanceRepository,
    @repository(BalanceReserveRepository) private reserveRepo: BalanceReserveRepository,
    @inject(RestBindings.Http.RESPONSE) private response: Response,
  ) { }
  /**
   *
   *
   * @param _requestBody Created courier
   */
  @operation('post', '/balance/add', {
    operationId: 'addBalance',
    responses: {
      '200': {
        description: 'OK',
      },
    },
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Balance',
          },
        },
      },
      description: 'Created courier',
      required: true,
    },
  })
  async addBalance(@requestBody({
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/Balance',
        },
      },
    },
    description: 'Created courier',
    required: true,
  }) _requestBody: Balance): Promise<unknown> {
    const id = _requestBody.user_id;
    let sum = (await this.balanceRepo.findById(id)).balance;
    if (sum) {
      await this.balanceRepo.updateById(id, {balance: sum + _requestBody.balance})
      return
    } else {
      const result = await this.balanceRepo.create(_requestBody)
      return result
    }
  }
  /**
   *
   *
   * @param _requestBody Created reserve balance
   */
  @operation('post', '/balance/reserve', {
    operationId: 'reserveBalance',
    responses: {
      '200': {
        description: 'OK',
      },
    },
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/BalanceReserve',
          },
        },
      },
      description: 'Created reserve balance',
      required: true,
    },
  })
  async reserveBalance(@requestBody({
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/BalanceReserve',
        },
      },
    },
    description: 'Created reserve balance',
    required: true,
  }) _requestBody: BalanceReserve): Promise<unknown> {
    const orderID = _requestBody.order_id;
    if (_requestBody.completed) {
      await this.reserveRepo.updateById(orderID, {completed: true});
      return
    } else {
      if (!_requestBody.user_id) return this.response.status(404).send({
        error: "Error! The user ID is empty!"
      });
      const userID = _requestBody.user_id;
      let balance = (await this.balanceRepo.findById(userID)).balance;
      const rest = balance - (_requestBody.price ?? 0)
      if (rest < 0) {
        return this.response.status(400).send({
          error: "Недостаточно средст на счете!"
        })
      }
      await this.balanceRepo.updateById(userID, {balance: rest})
      const result = await this.reserveRepo.create(_requestBody)
      return result
    }
  }
  /**
   *
   *
   * @param _requestBody Created reserve balance
   */
  @operation('delete', '/balance/reserve', {
    operationId: 'deleteReserve',
    responses: {
      '200': {
        description: 'OK',
      },
    },
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/BalanceReserve',
          },
        },
      },
      description: 'Created reserve balance',
      required: true,
    },
  })
  async deleteReserve(@requestBody({
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/BalanceReserve',
        },
      },
    },
    description: 'Created reserve balance',
    required: true,
  }) _requestBody: BalanceReserve): Promise<unknown> {
    let orderID = _requestBody.order_id;
    let reserved = await this.reserveRepo.findById(orderID);
    let userID = reserved.user_id;
    if (!userID) return this.response.status(400).send({
      error: "Error! The user ID does not found!"
    });
    let balance = (await this.balanceRepo.findById(userID)).balance
    await this.balanceRepo.updateById(userID, {balance: balance + (reserved.price ?? 0)});
    await this.reserveRepo.deleteById(orderID);
    return
  }
}

