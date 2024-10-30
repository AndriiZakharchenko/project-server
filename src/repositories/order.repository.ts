import OrderModel from '../models/order.model';
import ProductModel from '../models/product.model';

export class OrderRepository {
  static async createOrder(userId: string) {
    try {
      const data = await OrderModel.findOne({ userId });
      const product = await ProductModel.findOne({ id: 'c28e1102-a952-4c8e-92f7-e2c34d30af95' });

      if (!data || JSON.stringify(data) === '[]') {
        const newCart = new OrderModel({
          userId,
          items: [{
            product,
            count: 1,
          }],
          payment: {
            type: 'credit card',
            address: '123 Main St, Example City',
            creditCard: '4111111111111111',
          },
          delivery: {
            type: 'standard',
            address: '123 Main St, Example City',
          },
          comments: 'Please deliver between 9am and 5pm.',
          status: 'created',
          total: 0,
        });

        await newCart.save();
        return newCart;
      }

      return data;
    } catch (error) {
      return error;
    }
  }
}
