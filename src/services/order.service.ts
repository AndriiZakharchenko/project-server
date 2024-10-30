import { ERROR_MESSAGES } from '../constants';
import { OrderRepository } from '../repositories/order.repository';
import { IOrder } from '../types';

export class OrderService {
  static async createOrder(userId: string) {
    try {
      const data = await OrderRepository.createOrder(userId) as IOrder;

      return {
        data: {
          order: data,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: { message: ERROR_MESSAGES[500].SERVER_ERROR } };
    }
  }
}
